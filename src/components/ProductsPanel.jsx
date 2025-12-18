export default function ProductsPanel({
  products,
  productForm,
  productId,
  productValid,
  onSelect,
  onChangeId,
  onChangeForm,
  onCreate,
  onUpdate,
  onLoadById,
  onDelete,
  onRefresh,
}) {
  return (
    <section className="panel grid">
      <div>
        <div className="panel__header">
          <h2>📦 Termékek</h2>
          <button onClick={onRefresh}>Frissítés</button>
        </div>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p>Nincs termék</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Név</th>
                  <th>Ár</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id || p.productId || p.name} onClick={() => onSelect(p)}>
                    <td>{p.id ?? p.productId ?? '—'}</td>
                    <td>{p.name ?? '—'}</td>
                    <td>{p.price ?? '—'} Ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-card">
        <h3>Termék műveletek</h3>
        <label>
          Termék ID
          <input value={productId} onChange={(e) => onChangeId(e.target.value)} placeholder="pl. 1" />
        </label>
        <label>
          Név
          <input
            value={productForm.name}
            onChange={(e) => onChangeForm({ ...productForm, name: e.target.value })}
            placeholder="Alma"
          />
        </label>
        <label>
          Ár
          <input
            type="number"
            value={productForm.price}
            onChange={(e) => onChangeForm({ ...productForm, price: e.target.value })}
            placeholder="0"
          />
        </label>
        <div className="actions">
          <button onClick={onCreate} disabled={!productValid}>
            Új termék
          </button>
          <button onClick={onUpdate} disabled={!productValid || !productId}>
            Mentés
          </button>
          <button className="ghost" onClick={onLoadById} disabled={!productId}>
            Betölt ID alapján
          </button>
          <button className="danger" onClick={onDelete} disabled={!productId}>
            Törlés
          </button>
        </div>
      </div>
    </section>
  )
}
