import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QueryConstraint,
  Query,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Order, OrderStatus, User, Product, Category, UserRole } from '@/types';

// Convert Firestore timestamp to Date
function convertTimestamp(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
}

// Convert Date to Firestore timestamp
function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

// Users
export const userService = {
  get: async (userId: string): Promise<User | null> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as User;
  },

  getAll: async (): Promise<User[]> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as User[];
  },

  getByRole: async (role: UserRole): Promise<User[]> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const q = query(
      collection(db, 'users'),
      where('role', '==', role),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as User[];
  },

  create: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(collection(db, 'users'));
    const now = new Date();
    await setDoc(docRef, {
      ...user,
      createdAt: toTimestamp(now),
      updatedAt: toTimestamp(now),
    });
    return docRef.id;
  },

  update: async (userId: string, updates: Partial<User>): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: toTimestamp(new Date()),
    });
  },

  delete: async (userId: string): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    await deleteDoc(doc(db, 'users', userId));
  },
};

// Orders
export const orderService = {
  get: async (orderId: string): Promise<Order | null> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
      deliveredAt: data.deliveredAt ? convertTimestamp(data.deliveredAt) : undefined,
    } as Order;
  },

  getAll: async (constraints: QueryConstraint[] = []): Promise<Order[]> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const q = query(collection(db, 'orders'), ...constraints, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        deliveredAt: data.deliveredAt ? convertTimestamp(data.deliveredAt) : undefined,
      };
    }) as Order[];
  },

  getByStatus: async (status: OrderStatus): Promise<Order[]> => {
    return orderService.getAll([where('status', '==', status)]);
  },

  getByPicker: async (pickerId: string): Promise<Order[]> => {
    return orderService.getAll([where('pickerId', '==', pickerId)]);
  },

  getByCourier: async (courierId: string): Promise<Order[]> => {
    return orderService.getAll([where('courierId', '==', courierId)]);
  },

  subscribe: (
    callback: (orders: Order[]) => void,
    constraints: QueryConstraint[] = []
  ): (() => void) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    let q: Query;
    if (constraints.length > 0) {
      q = query(collection(db, 'orders'), ...constraints, orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    }
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
          deliveredAt: data.deliveredAt ? convertTimestamp(data.deliveredAt) : undefined,
        };
      }) as Order[];
      callback(orders);
    });
  },

  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(collection(db, 'orders'));
    const now = new Date();
    await setDoc(docRef, {
      ...order,
      createdAt: toTimestamp(now),
      updatedAt: toTimestamp(now),
    });
    return docRef.id;
  },

  update: async (orderId: string, updates: Partial<Order>): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'orders', orderId);
    const updateData: any = {
      ...updates,
      updatedAt: toTimestamp(new Date()),
    };
    if (updates.status === OrderStatus.DELIVERED && !updates.deliveredAt) {
      updateData.deliveredAt = toTimestamp(new Date());
    }
    await updateDoc(docRef, updateData);
  },

  delete: async (orderId: string): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    await deleteDoc(doc(db, 'orders', orderId));
  },
};

// Products
export const productService = {
  get: async (productId: string): Promise<Product | null> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Product;
  },

  getAll: async (): Promise<Product[]> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Product[];
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const q = query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Product[];
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(collection(db, 'products'));
    const now = new Date();
    await setDoc(docRef, {
      ...product,
      createdAt: toTimestamp(now),
      updatedAt: toTimestamp(now),
    });
    return docRef.id;
  },

  update: async (productId: string, updates: Partial<Product>): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: toTimestamp(new Date()),
    });
  },

  delete: async (productId: string): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    await deleteDoc(doc(db, 'products', productId));
  },
};

// Categories
export const categoryService = {
  get: async (categoryId: string): Promise<Category | null> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'categories', categoryId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Category;
  },

  getAll: async (): Promise<Category[]> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Category[];
  },

  create: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(collection(db, 'categories'));
    const now = new Date();
    await setDoc(docRef, {
      ...category,
      createdAt: toTimestamp(now),
      updatedAt: toTimestamp(now),
    });
    return docRef.id;
  },

  update: async (categoryId: string, updates: Partial<Category>): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: toTimestamp(new Date()),
    });
  },

  delete: async (categoryId: string): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    await deleteDoc(doc(db, 'categories', categoryId));
  },
};

