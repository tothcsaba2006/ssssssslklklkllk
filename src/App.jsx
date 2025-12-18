import { useEffect, useMemo, useState } from 'react'
import CartPanel from './components/CartPanel'
import CustomersPanel from './components/CustomersPanel'
import ProductsPanel from './components/ProductsPanel'
import './App.css'

const API_BASE = 'https://localhost:7242/api'

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }

  if (response.status === 204) return null
  return response.json()
}

function App() {
  const [cart, setCart] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])

  const [customerForm, setCustomerForm] = useState({ name: '' })
  const [customerId, setCustomerId] = useState('')

  const [productForm, setProductForm] = useState({ name: '', price: '' })
  const [productId, setProductId] = useState('')

  const [messages, setMessages] = useState([])
  const apiInfo = useMemo(() => new URL(API_BASE), [])

  const customerValid = customerForm.name.trim().length > 0
  const customerIdPresent = Boolean(customerId)
  const productPriceNumber = Number(productForm.price)
  const productValid =
    productForm.name.trim().length > 0 &&
    productForm.price !== '' &&
    !Number.isNaN(productPriceNumber)


  const pushMessage = (type, text) => {
    setMessages((prev) => [{ id: crypto.randomUUID(), type, text }, ...prev].slice(0, 4))
  }

  const refreshAll = async () => {
    await Promise.all([loadCart(), loadCustomers(), loadProducts()])
  }

  const loadCart = async () => {
    try {
      const data = await apiRequest('/Cart')
      setCart(Array.isArray(data) ? data : [data].filter(Boolean))
    } catch (err) {
      pushMessage('error', `Cart error: ${err.message}`)
    }
  }

  const selectCustomer = (c) => {
    setCustomerId(c.id ?? c.customerId ?? '')
    setCustomerForm({ name: c.name ?? '' })
  }

  const loadCustomers = async () => {
    try {
      const data = await apiRequest('/Customers')
      setCustomers(Array.isArray(data) ? data : [])
    } catch (err) {
      pushMessage('error', `Customers error: ${err.message}`)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await apiRequest('/Products')
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      pushMessage('error', `Products error: ${err.message}`)
    }
  }

  const createCustomer = async (evt) => {
    evt.preventDefault()
    if (!customerValid) {
      pushMessage('error', 'Name is required')
      return
    }
    try {
      await apiRequest('/Customers', {
        method: 'POST',
        body: JSON.stringify({
          Name: customerForm.name,
        }),
      })
      setCustomerForm({ name: '' })
      await loadCustomers()
      pushMessage('success', 'Customer created')
    } catch (err) {
      pushMessage('error', `Create failed: ${err.message}`)
    }
  }

  const updateCustomer = async (evt) => {
    evt.preventDefault()
    if (!customerIdPresent) {
      pushMessage('error', 'Provide a customer ID to update')
      return
    }
    if (!customerValid) {
      pushMessage('error', 'Name is required for update')
      return
    }
    try {
      await apiRequest(`/Customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify({
          Id: Number(customerId),
          Name: customerForm.name,
        }),
      })
      await loadCustomers()
      pushMessage('success', `Customer updated: ${customerId}`)
    } catch (err) {
      pushMessage('error', `Update failed: ${err.message}`)
    }
  }

  const deleteCustomer = async () => {
    if (!customerId) {
      pushMessage('error', 'Provide a customer ID to delete')
      return
    }
    try {
      await apiRequest(`/Customers/${customerId}`, { method: 'DELETE' })
      await loadCustomers()
      pushMessage('success', `Customer deleted: ${customerId}`)
    } catch (err) {
      pushMessage('error', `Delete failed: ${err.message}`)
    }
  }

  const loadCustomerById = async () => {
    if (!customerId) {
      pushMessage('error', 'Provide a customer ID to load')
      return
    }
    try {
      const data = await apiRequest(`/Customers/${customerId}`)
      setCustomerForm({
        name: data.name ?? '',
      })
      pushMessage('success', `Customer loaded: ${customerId}`)
    } catch (err) {
      pushMessage('error', `Load failed: ${err.message}`)
    }
  }

  const createProduct = async (evt) => {
    evt.preventDefault()
    if (!productValid) {
      pushMessage('error', 'Product name and price are required')
      return
    }
    try {
      await apiRequest('/Products', {
        method: 'POST',
        body: JSON.stringify({
          Name: productForm.name,
          Price: productPriceNumber,
        }),
      })
      setProductForm({ name: '', price: '' })
      await loadProducts()
      pushMessage('success', 'Product created')
    } catch (err) {
      pushMessage('error', `Product create failed: ${err.message}`)
    }
  }

  const updateProduct = async (evt) => {
    evt.preventDefault()
    if (!productId) {
      pushMessage('error', 'Provide a product ID to update')
      return
    }
    if (!productValid) {
      pushMessage('error', 'Product name and price are required for update')
      return
    }
    try {
      await apiRequest(`/Products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          Id: Number(productId),
          Name: productForm.name,
          Price: productPriceNumber,
        }),
      })
      await loadProducts()
      pushMessage('success', `Product updated: ${productId}`)
    } catch (err) {
      pushMessage('error', `Product update failed: ${err.message}`)
    }
  }

  const deleteProduct = async () => {
    if (!productId) {
      pushMessage('error', 'Provide a product ID to delete')
      return
    }
    try {
      await apiRequest(`/Products/${productId}`, { method: 'DELETE' })
      await loadProducts()
      pushMessage('success', `Product deleted: ${productId}`)
      setProductId('')
      setProductForm({ name: '', price: '' })
    } catch (err) {
      pushMessage('error', `Product delete failed: ${err.message}`)
    }
  }

  const selectProduct = (p) => {
    setProductId(p.id ?? p.productId ?? '')
    setProductForm({
      name: p.name ?? '',
      price: p.price ?? '',
    })
  }

  const loadProductById = async () => {
    if (!productId) {
      pushMessage('error', 'Provide a product ID to load')
      return
    }
    try {
      const data = await apiRequest(`/Products/${productId}`)
      setProductForm({
        name: data.name ?? '',
        price: data.price ?? '',
      })
      pushMessage('success', `Product loaded: ${productId}`)
    } catch (err) {
      pushMessage('error', `Load failed: ${err.message}`)
    }
  }

  useEffect(() => {
    refreshAll()
  }, [] )

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Minimal API Client</p>
          <h1>Shop Dashboard</h1>
          <p className="muted">API: {apiInfo.origin}</p>
        </div>
        <button className="ghost" onClick={refreshAll}>
          Refresh
        </button>
      </header>

      {messages.length > 0 && (
        <div className="stack">
          {messages.map((m) => (
            <div key={m.id} className={`toast ${m.type}`}>
              {m.text}
            </div>
          ))}
        </div>
      )}

      <CartPanel cart={cart} onRefresh={loadCart} />

      <CustomersPanel
        customers={customers}
        customerForm={customerForm}
        customerId={customerId}
        customerValid={customerValid}
        customerIdPresent={customerIdPresent}
        onSelect={selectCustomer}
        onChangeId={setCustomerId}
        onChangeForm={setCustomerForm}
        onCreate={createCustomer}
        onUpdate={updateCustomer}
        onLoadById={loadCustomerById}
        onDelete={deleteCustomer}
        onRefresh={loadCustomers}
      />

      <ProductsPanel
        products={products}
        productForm={productForm}
        productId={productId}
        productValid={productValid}
        onSelect={selectProduct}
        onChangeId={setProductId}
        onChangeForm={setProductForm}
        onCreate={createProduct}
        onUpdate={updateProduct}
        onLoadById={loadProductById}
        onDelete={deleteProduct}
        onRefresh={loadProducts}
      />
    </div>
  )
}

export default App