import { useState } from 'react'
import * as React from 'react'
import { Building2, FileText, CreditCard, TrendingUp, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import './App.css'

type Task = {
  id: string
  name: string
  budget: number
  startDate: string
  endDate: string
  monthlyProgress: { month: string; percentage: number; value: number }[]
}

type Material = {
  id: string
  name: string
  quantity: number
  unitPrice: number
  supplier: string
  status: 'ordered' | 'delivered' | 'pending'
}

type Invoice = {
  id: string
  supplier: string
  amount: number
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
}

type Payment = {
  id: string
  description: string
  amount: number
  date: string
  type: 'income' | 'expense'
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bwps-tasks')
    return saved ? JSON.parse(saved) : []
  })
  
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('bwps-materials')
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Steel Beams', quantity: 50, unitPrice: 200, supplier: 'ABC Materials', status: 'ordered' },
      { id: '2', name: 'Concrete Mix', quantity: 100, unitPrice: 80, supplier: 'BuildCorp', status: 'delivered' },
      { id: '3', name: 'Rebar', quantity: 200, unitPrice: 15, supplier: 'XYZ Construction', status: 'pending' }
    ]
  })
  
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bwps-invoices')
    return saved ? JSON.parse(saved) : [
      { id: '1', supplier: 'ABC Materials', amount: 10000, dueDate: '2025-02-15', status: 'pending' },
      { id: '2', supplier: 'BuildCorp', amount: 8000, dueDate: '2025-01-30', status: 'paid' },
      { id: '3', supplier: 'XYZ Construction', amount: 3000, dueDate: '2025-01-20', status: 'overdue' }
    ]
  })
  
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('bwps-payments')
    return saved ? JSON.parse(saved) : [
      { id: '1', description: 'Project Payment - Phase 1', amount: 50000, date: '2025-01-15', type: 'income' },
      { id: '2', description: 'Material Purchase', amount: 15000, date: '2025-01-10', type: 'expense' },
      { id: '3', description: 'Equipment Rental', amount: 5000, date: '2025-01-08', type: 'expense' },
      { id: '4', description: 'Project Payment - Phase 2', amount: 30000, date: '2025-01-20', type: 'income' }
    ]
  })

  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSupplier, setFilterSupplier] = useState('all')
  const [filterType, setFilterType] = useState('all')

  React.useEffect(() => {
    localStorage.setItem('bwps-tasks', JSON.stringify(tasks))
  }, [tasks])

  React.useEffect(() => {
    localStorage.setItem('bwps-materials', JSON.stringify(materials))
  }, [materials])

  React.useEffect(() => {
    localStorage.setItem('bwps-invoices', JSON.stringify(invoices))
  }, [invoices])

  React.useEffect(() => {
    localStorage.setItem('bwps-payments', JSON.stringify(payments))
  }, [payments])

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: 'New Task',
      budget: 10000,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      monthlyProgress: []
    }
    setTasks([...tasks, newTask])
  }

  const addMonthlyProgress = (taskId: string, month: string, percentage: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const totalProgress = task.monthlyProgress.reduce((sum, p) => sum + p.percentage, 0)
        if (totalProgress + percentage > 100) {
          alert('Total progress cannot exceed 100%')
          return task
        }
        const value = (task.budget * percentage) / 100
        return {
          ...task,
          monthlyProgress: [...task.monthlyProgress, { month, percentage, value }]
        }
      }
      return task
    }))
  }

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: 'New Material',
      quantity: 1,
      unitPrice: 100,
      supplier: 'ABC Materials',
      status: 'pending'
    }
    setMaterials([...materials, newMaterial])
  }

  const addInvoice = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      supplier: 'New Supplier',
      amount: 1000,
      dueDate: '2025-02-01',
      status: 'pending'
    }
    setInvoices([...invoices, newInvoice])
  }

  const addPayment = () => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      description: 'New Payment',
      amount: 1000,
      date: '2025-01-26',
      type: 'expense'
    }
    setPayments([...payments, newPayment])
  }

  const filteredMaterials = materials.filter(material => 
    filterStatus === 'all' || material.status === filterStatus
  ).filter(material =>
    filterSupplier === 'all' || material.supplier === filterSupplier
  )

  const filteredInvoices = invoices.filter(invoice =>
    filterStatus === 'all' || invoice.status === filterStatus
  ).filter(invoice =>
    filterSupplier === 'all' || invoice.supplier === filterSupplier
  )

  const filteredPayments = payments.filter(payment =>
    filterType === 'all' || payment.type === filterType
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Total Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Materials</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">{materials.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Pending Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">{invoices.filter(i => i.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              ${payments.reduce((sum, p) => sum + (p.type === 'income' ? p.amount : -p.amount), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Monthly Task Progress</CardTitle>
          <CardDescription className="text-gray-400">Track progress and cost allocation per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            {tasks.map(task => (
              <div key={task.id} className="border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-100 mb-2">{task.name}</h4>
                <p className="text-sm text-gray-400 mb-2">Budget: ${task.budget.toLocaleString()}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <Input placeholder="Month (YYYY-MM)" className="bg-gray-800 border-gray-700 text-gray-100" />
                  <Input placeholder="Percentage" type="number" className="bg-gray-800 border-gray-700 text-gray-100" />
                  <Button onClick={() => addMonthlyProgress(task.id, '2025-01', 25)} size="sm" className="bg-green-600 hover:bg-green-700">
                    Add Progress
                  </Button>
                </div>
                <div className="space-y-1">
                  {task.monthlyProgress.map((progress, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-300">
                      <span>{progress.month}</span>
                      <span>{progress.percentage}% - ${progress.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="text-sm text-gray-400">
                    Total Progress: {task.monthlyProgress.reduce((sum, p) => sum + p.percentage, 0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMaterialsInvoices = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Materials & Invoices</CardTitle>
          <CardDescription className="text-gray-400">Manage materials and track invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSupplier} onValueChange={setFilterSupplier}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="ABC Materials">ABC Materials</SelectItem>
                <SelectItem value="XYZ Construction">XYZ Construction</SelectItem>
                <SelectItem value="BuildCorp">BuildCorp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-100">Materials</h3>
                <Button onClick={addMaterial} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Quantity</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map(material => (
                    <TableRow key={material.id} className="border-gray-700">
                      <TableCell className="text-gray-100">{material.name}</TableCell>
                      <TableCell className="text-gray-100">{material.quantity}</TableCell>
                      <TableCell className="text-gray-100">{material.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-100">Invoices</h3>
                <Button onClick={addInvoice} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invoice
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Supplier</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map(invoice => (
                    <TableRow key={invoice.id} className="border-gray-700">
                      <TableCell className="text-gray-100">{invoice.supplier}</TableCell>
                      <TableCell className="text-gray-100">${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-100">{invoice.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPaymentsInvoicing = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Payments & Invoicing</CardTitle>
          <CardDescription className="text-gray-400">Track payments and manage invoicing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addPayment} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id} className="border-gray-700">
                  <TableCell className="text-gray-100">{payment.description}</TableCell>
                  <TableCell className="text-gray-100">${payment.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-100">{payment.date}</TableCell>
                  <TableCell className="text-gray-100">
                    <span className={payment.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                      {payment.type}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderCashFlow = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Cash Flow</CardTitle>
          <CardDescription className="text-gray-400">Monitor project cash flow and financial health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  ${payments.filter(p => p.type === 'income').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">
                  ${payments.filter(p => p.type === 'expense').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300">Net Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">
                  ${payments.reduce((sum, p) => sum + (p.type === 'income' ? p.amount : -p.amount), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Running Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment, index) => {
                const runningBalance = filteredPayments.slice(0, index + 1).reduce((sum, p) => 
                  sum + (p.type === 'income' ? p.amount : -p.amount), 0
                )
                return (
                  <TableRow key={payment.id} className="border-gray-700">
                    <TableCell className="text-gray-100">{payment.date}</TableCell>
                    <TableCell className="text-gray-100">{payment.description}</TableCell>
                    <TableCell className="text-gray-100">${payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-100">
                      <span className={payment.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                        {payment.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-100">${runningBalance.toLocaleString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-100">BWPS Project Management</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className={activeTab === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:text-gray-100'}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'materials' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('materials')}
              className={activeTab === 'materials' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:text-gray-100'}
            >
              Materials & Invoices
            </Button>
            <Button
              variant={activeTab === 'payments' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('payments')}
              className={activeTab === 'payments' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:text-gray-100'}
            >
              Payments & Invoicing
            </Button>
            <Button
              variant={activeTab === 'cashflow' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('cashflow')}
              className={activeTab === 'cashflow' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:text-gray-100'}
            >
              Cash Flow
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'materials' && renderMaterialsInvoices()}
        {activeTab === 'payments' && renderPaymentsInvoicing()}
        {activeTab === 'cashflow' && renderCashFlow()}
      </main>
    </div>
  )
}

export default App
