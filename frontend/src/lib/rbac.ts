import { UserRole, OrderStatus } from '@/types';

// Permissions for each role
export const rolePermissions = {
  [UserRole.SUPER_ADMIN]: {
    canViewAllOrders: true,
    canManageUsers: true,
    canManageProducts: true,
    canManageCategories: true,
    canManageBanners: true,
    canViewStatistics: true,
    canAssignOrders: true,
    canChangeOrderStatus: true,
    canViewSystemSettings: true,
  },
  [UserRole.MANAGER]: {
    canViewAllOrders: true,
    canManageUsers: false,
    canManageProducts: false,
    canManageCategories: false,
    canManageBanners: false,
    canViewStatistics: true,
    canAssignOrders: true,
    canChangeOrderStatus: true,
    canViewSystemSettings: false,
  },
  [UserRole.PICKER]: {
    canViewAllOrders: false,
    canManageUsers: false,
    canManageProducts: false,
    canManageCategories: false,
    canManageBanners: false,
    canViewStatistics: false,
    canAssignOrders: false,
    canChangeOrderStatus: true,
    canViewSystemSettings: false,
  },
  [UserRole.COURIER]: {
    canViewAllOrders: false,
    canManageUsers: false,
    canManageProducts: false,
    canManageCategories: false,
    canManageBanners: false,
    canViewStatistics: false,
    canAssignOrders: false,
    canChangeOrderStatus: true,
    canViewSystemSettings: false,
  },
};

// Allowed status transitions for each role
export const allowedStatusTransitions: Record<UserRole, OrderStatus[]> = {
  [UserRole.SUPER_ADMIN]: [
    OrderStatus.NEW,
    OrderStatus.ASSIGNED_TO_PICKER,
    OrderStatus.PICKED,
    OrderStatus.ASSIGNED_TO_COURIER,
    OrderStatus.IN_DELIVERY,
    OrderStatus.DELIVERED,
  ],
  [UserRole.MANAGER]: [
    OrderStatus.NEW,
    OrderStatus.ASSIGNED_TO_PICKER,
    OrderStatus.PICKED,
    OrderStatus.ASSIGNED_TO_COURIER,
    OrderStatus.IN_DELIVERY,
    OrderStatus.DELIVERED,
  ],
  [UserRole.PICKER]: [
    OrderStatus.ASSIGNED_TO_PICKER,
    OrderStatus.PICKED,
  ],
  [UserRole.COURIER]: [
    OrderStatus.ASSIGNED_TO_COURIER,
    OrderStatus.IN_DELIVERY,
    OrderStatus.DELIVERED,
  ],
};

// Check if user can perform action
export function canPerformAction(
  userRole: UserRole,
  action: keyof typeof rolePermissions[UserRole.SUPER_ADMIN]
): boolean {
  return rolePermissions[userRole]?.[action] ?? false;
}

// Check if status transition is allowed
export function canChangeToStatus(
  userRole: UserRole,
  newStatus: OrderStatus
): boolean {
  return allowedStatusTransitions[userRole]?.includes(newStatus) ?? false;
}

// Get next valid statuses for current status and role
export function getNextValidStatuses(
  currentStatus: OrderStatus,
  userRole: UserRole
): OrderStatus[] {
  const allowed = allowedStatusTransitions[userRole] || [];
  
  const statusFlow: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.NEW]: [OrderStatus.ASSIGNED_TO_PICKER],
    [OrderStatus.ASSIGNED_TO_PICKER]: [OrderStatus.PICKED],
    [OrderStatus.PICKED]: [OrderStatus.ASSIGNED_TO_COURIER],
    [OrderStatus.ASSIGNED_TO_COURIER]: [OrderStatus.IN_DELIVERY],
    [OrderStatus.IN_DELIVERY]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
  };

  const nextStatuses = statusFlow[currentStatus] || [];
  return nextStatuses.filter(status => allowed.includes(status));
}

