import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'trial';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivity?: Timestamp;
  plan?: 'free' | 'pro' | 'enterprise';
  source?: string;
  notes?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: Timestamp;
  lastSync?: Timestamp;
  config?: Record<string, any>;
  userId: string;
}

export interface Analytics {
  id: string;
  date: string;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newSignups: number;
    conversions: number;
    revenue: number;
    churnRate: number;
  };
  createdAt: Timestamp;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

// Customer Service
export class CustomerService {
  private static collection = 'customers';

  static async getCustomers(): Promise<Customer[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  static async getCustomer(id: string): Promise<Customer | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Customer;
      }
      return null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  static async addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, this.collection), {
        ...customer,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  }

  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  static async deleteCustomer(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  static subscribeToCustomers(callback: (customers: Customer[]) => void): () => void {
    const q = query(
      collection(db, this.collection),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const customers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      callback(customers);
    });
  }
}

// Integration Service
export class IntegrationService {
  private static collection = 'integrations';

  static async getIntegrations(userId: string): Promise<Integration[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('connectedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Integration[];
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
  }

  static async addIntegration(integration: Omit<Integration, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...integration,
        connectedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding integration:', error);
      throw error;
    }
  }

  static async updateIntegration(id: string, updates: Partial<Integration>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
  }

  static async deleteIntegration(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting integration:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  private static collection = 'analytics';

  static async getAnalytics(days: number = 30): Promise<Analytics[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('date', 'desc'),
        limit(days)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Analytics[];
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  static async addAnalytics(analytics: Omit<Analytics, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...analytics,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding analytics:', error);
      throw error;
    }
  }

  static async getTodayAnalytics(): Promise<Analytics | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, this.collection),
        where('date', '==', today),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Analytics;
      }
      return null;
    } catch (error) {
      console.error('Error fetching today analytics:', error);
      throw error;
    }
  }
}

// User Activity Service
export class UserActivityService {
  private static collection = 'user_activities';

  static async logActivity(activity: Omit<UserActivity, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...activity,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  static async getUserActivities(userId: string, limitCount: number = 50): Promise<UserActivity[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserActivity[];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  }
}

// Initialize sample data
export const initializeSampleData = async (userId: string) => {
  try {
    // Check if data already exists
    const customers = await CustomerService.getCustomers();
    if (customers.length > 0) return;

    // Add sample customers
    const sampleCustomers = [
      {
        name: 'John Smith',
        email: 'john@techcorp.com',
        company: 'TechCorp Inc.',
        status: 'active' as const,
        plan: 'pro' as const,
        source: 'website',
        notes: 'Interested in enterprise features'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@startup.io',
        company: 'StartupIO',
        status: 'trial' as const,
        plan: 'free' as const,
        source: 'referral',
        notes: 'Trial expires in 7 days'
      },
      {
        name: 'Mike Chen',
        email: 'mike@enterprise.com',
        company: 'Enterprise Solutions',
        status: 'active' as const,
        plan: 'enterprise' as const,
        source: 'sales',
        notes: 'High-value customer'
      }
    ];

    for (const customer of sampleCustomers) {
      await CustomerService.addCustomer(customer);
    }

    // Add sample integrations
    const sampleIntegrations = [
      {
        name: 'Slack',
        type: 'communication',
        status: 'connected' as const,
        userId,
        config: { channel: '#general' }
      },
      {
        name: 'Google Drive',
        type: 'storage',
        status: 'connected' as const,
        userId,
        config: { folder: 'MiniTandem' }
      }
    ];

    for (const integration of sampleIntegrations) {
      await IntegrationService.addIntegration(integration);
    }

    // Add sample analytics
    const today = new Date().toISOString().split('T')[0];
    const sampleAnalytics = {
      date: today,
      metrics: {
        totalUsers: 1250,
        activeUsers: 890,
        newSignups: 45,
        conversions: 12,
        revenue: 2400,
        churnRate: 2.1
      }
    };

    await AnalyticsService.addAnalytics(sampleAnalytics);

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};
