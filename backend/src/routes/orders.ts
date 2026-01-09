import express, { Router, Response } from 'express';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { z } from 'zod';

export const orderRouter = Router();

// All order routes require authentication
orderRouter.use(authenticateToken);

const assignPickerSchema = z.object({
  pickerId: z.string().min(1),
});

const assignCourierSchema = z.object({
  courierId: z.string().min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(['new', 'assigned_to_picker', 'picked', 'assigned_to_courier', 'in_delivery', 'delivered']),
});

// Assign order to picker (Manager or Super Admin only)
orderRouter.post('/:orderId/assign-picker', requireRole('manager', 'super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const validation = assignPickerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid request data', errors: validation.error.errors });
    }

    const { pickerId } = validation.data;

    // Verify picker exists and has correct role
    const pickerDoc = await db.collection('users').doc(pickerId).get();
    if (!pickerDoc.exists) {
      return res.status(404).json({ message: 'Picker not found' });
    }

    const pickerData = pickerDoc.data();
    if (pickerData?.role !== 'picker') {
      return res.status(400).json({ message: 'User is not a picker' });
    }

    // Get order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (orderData?.status !== 'new' && orderData?.status !== 'assigned_to_picker') {
      return res.status(400).json({ message: 'Order cannot be assigned to picker in current status' });
    }

    // Update order
    await db.collection('orders').doc(orderId).update({
      pickerId,
      managerId: req.userId,
      status: 'assigned_to_picker',
      updatedAt: new Date(),
    });

    res.json({ message: 'Order assigned to picker successfully', orderId });
  } catch (error: any) {
    console.error('Error assigning order to picker:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Assign order to courier (Manager or Super Admin only)
orderRouter.post('/:orderId/assign-courier', requireRole('manager', 'super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const validation = assignCourierSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid request data', errors: validation.error.errors });
    }

    const { courierId } = validation.data;

    // Verify courier exists and has correct role
    const courierDoc = await db.collection('users').doc(courierId).get();
    if (!courierDoc.exists) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    const courierData = courierDoc.data();
    if (courierData?.role !== 'courier') {
      return res.status(400).json({ message: 'User is not a courier' });
    }

    // Get order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (orderData?.status !== 'picked') {
      return res.status(400).json({ message: 'Order must be picked before assigning to courier' });
    }

    // Update order
    await db.collection('orders').doc(orderId).update({
      courierId,
      status: 'assigned_to_courier',
      updatedAt: new Date(),
    });

    res.json({ message: 'Order assigned to courier successfully', orderId });
  } catch (error: any) {
    console.error('Error assigning order to courier:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Update order status
orderRouter.patch('/:orderId/status', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const validation = updateStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid request data', errors: validation.error.errors });
    }

    const { status } = validation.data;

    // Get order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderData = orderDoc.data();
    const currentStatus = orderData?.status;

    // Role-based status validation
    if (req.userRole === 'picker') {
      if (status !== 'picked' || currentStatus !== 'assigned_to_picker') {
        return res.status(403).json({ message: 'Picker can only mark orders as picked' });
      }
      if (orderData?.pickerId !== req.userId) {
        return res.status(403).json({ message: 'Order not assigned to you' });
      }
    } else if (req.userRole === 'courier') {
      if (!['in_delivery', 'delivered'].includes(status)) {
        return res.status(403).json({ message: 'Courier can only update delivery status' });
      }
      if (orderData?.courierId !== req.userId) {
        return res.status(403).json({ message: 'Order not assigned to you' });
      }
      if (status === 'in_delivery' && currentStatus !== 'assigned_to_courier') {
        return res.status(400).json({ message: 'Order must be assigned to courier first' });
      }
      if (status === 'delivered' && currentStatus !== 'in_delivery') {
        return res.status(400).json({ message: 'Order must be in delivery first' });
      }
    } else if (!['manager', 'super_admin'].includes(req.userRole || '')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      new: ['assigned_to_picker'],
      assigned_to_picker: ['picked'],
      picked: ['assigned_to_courier'],
      assigned_to_courier: ['in_delivery'],
      in_delivery: ['delivered'],
      delivered: [],
    };

    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    // Update order
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    await db.collection('orders').doc(orderId).update(updateData);

    res.json({ message: 'Order status updated successfully', orderId, status });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

