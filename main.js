async function deleteBtn(item) {
  const res = await fetch(`${API_BASE}lists/${currentList}/items/${item._id}`, {
    method: "DELETE",
  }); // deletar objekt med _id.
  const { list } = await res.json(); // Hämtar den nya listan som där objektet är borttaget.
}
