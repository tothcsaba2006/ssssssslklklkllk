export default function CustomersPanel({
  customers,
  customerForm,
  customerId,
  customerValid,
  customerIdPresent,
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
          <h2>Ügyfelek</h2>
          <button onClick={onRefresh}>Lista frissítése</button>
        </div>
        {customers.length === 0 ? (
          <p className="muted">Nincs ügyfél</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Név</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={c.id || c.customerId || idx} onClick={() => onSelect(c)}>
                  <td>{c.id ?? c.customerId ?? '—'}</td>
                  <td>{c.name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="form-card">
        <h3>Ügyfél műveletek</h3>
        <label>
          Ügyfél ID
          <input value={customerId} onChange={(e) => onChangeId(e.target.value)} placeholder="pl. 1" />
        </label>
        <label>
          Név
          <input
            value={customerForm.name}
            onChange={(e) => onChangeForm({ ...customerForm, name: e.target.value })}
            placeholder="Kiss Péter"
          />
        </label>
        <div className="actions">
          <button onClick={onCreate} disabled={!customerValid}>
            Új ügyfél
          </button>
          <button onClick={onUpdate} disabled={!customerValid || !customerIdPresent}>
            Mentés
          </button>
          <button className="ghost" onClick={onLoadById} disabled={!customerIdPresent}>
            Betölt ID alapján
          </button>
          <button className="danger" onClick={onDelete} disabled={!customerIdPresent}>
            Törlés
          </button>
        </div>
      </div>
    </section>
  )
}
