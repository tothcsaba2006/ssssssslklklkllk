export default function CartPanel({ cart, onRefresh }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Shopping Basket</h2>
        <button onClick={onRefresh}>Refresh Basket</button>
      </div>
      {cart.length === 0 ? (
        <p className="muted">Basket is empty</p>
      ) : (
        <div className="list">
          {cart.map((item, idx) => (
            <pre key={idx}>{JSON.stringify(item, null, 2)}</pre>
          ))}
        </div>
      )}
    </section>
  )
}