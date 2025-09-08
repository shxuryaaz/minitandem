import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Building,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CustomerService, Customer, initializeSampleData } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Remove duplicate interface - using the one from firestore.ts

function AddCustomerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "trial" as const,
    plan: "free" as const,
    source: "website",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await CustomerService.addCustomer(formData);
      toast.success('Customer added successfully');
      setIsOpen(false);
      setFormData({ name: "", email: "", company: "", status: "trial", plan: "free", source: "website", notes: "" });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary" id="add-customer-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Company Name"
              className="mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load customers from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const loadCustomers = async () => {
      try {
        setLoading(true);
        // Initialize sample data if needed
        await initializeSampleData(currentUser.uid);
        
        // Subscribe to real-time updates
        const unsubscribe = CustomerService.subscribeToCustomers((customers) => {
          setCustomers(customers);
          setFilteredCustomers(customers);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error loading customers:', error);
        toast.error('Failed to load customers');
        setLoading(false);
      }
    };

    const unsubscribe = loadCustomers();
    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub());
      }
    };
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.company.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await CustomerService.deleteCustomer(id);
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const getStatusBadge = (status: Customer["status"]) => {
    const variants = {
      active: "bg-success/10 text-success border-success/20",
      inactive: "bg-muted text-muted-foreground",
      trial: "bg-warning/10 text-warning border-warning/20",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer base and track engagement
          </p>
        </div>
        <AddCustomerModal />
      </div>

      {/* Filters and Search */}
      <Card className="card-enterprise">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-enterprise">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-enterprise">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-muted-foreground">New This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-enterprise">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">94.2%</p>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Customer Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading customers...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {filteredCustomers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                              {customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {customer.company}
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>
                          {customer.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {customer.lastActivity?.toDate().toLocaleDateString() || 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}