// One short line per note, set off by the quiet left rule in .notelist.
// Shared by Experience, Research, Resume, and the project detail view.
export default function NoteList({ notes }) {
  if (!notes || notes.length === 0) return null
  return (
    <ul className="notelist">
      {notes.map((n) => (
        <li className="notelist__item" key={n}>
          {n}
        </li>
      ))}
    </ul>
  )
}
