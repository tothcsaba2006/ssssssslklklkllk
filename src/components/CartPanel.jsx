export default function CartPanel({ cart, onRefresh }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2>🛒 Kosár</h2>
        <button onClick={onRefresh}>Frissítés</button>
      </div>
      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛍️</div>
          <p>A kosár üres</p>
        </div>
      ) : (
        <div className="cart-grid">
          {cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <div className="cart-item__header">
                <div className="cart-item__title">
                  {item.productName || item.product?.name || 'Termék'}
                </div>
                <div className="cart-item__badge">#{idx + 1}</div>
              </div>
              <div className="cart-item__details">
                {item.customerName && (
                  <div className="cart-item__row">
                    <span className="cart-item__label">Vásárló:</span>
                    <span className="cart-item__value">{item.customerName}</span>
                  </div>
                )}
                {item.customerId && (
                  <div className="cart-item__row">
                    <span className="cart-item__label">Vásárló ID:</span>
                    <span className="cart-item__value">{item.customerId}</span>
                  </div>
                )}
                {item.productId && (
                  <div className="cart-item__row">
                    <span className="cart-item__label">Termék ID:</span>
                    <span className="cart-item__value">{item.productId}</span>
                  </div>
                )}
                {item.quantity && (
                  <div className="cart-item__row">
                    <span className="cart-item__label">Mennyiség:</span>
                    <span className="cart-item__value">{item.quantity} db</span>
                  </div>
                )}
                {item.price !== undefined && (
                  <div className="cart-item__row">
                    <span className="cart-item__label">Ár:</span>
                    <span className="cart-item__price">{item.price} Ft</span>
                  </div>
                )}
              </div>
              {Object.keys(item).length > 0 && (
                <details>
                  <summary style={{ cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Részletek
                  </summary>
                  <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}