interface History {
  id: number;
  ip_address: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface TableProps {
  links?: PaginationLink[];
  data: History[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  onRowClick?: (ip: string) => void;
  fetchPage?: (url: string) => void;
}

const Table = ({ data, selectedIds, setSelectedIds, onRowClick, links, fetchPage }: TableProps) => {
  const toggleCheckbox = (id: number) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === data.length) setSelectedIds([]);
    else setSelectedIds(data.map(h => h.id));
  };

  return (
    <div className="space-y-2">
      <table className="border text-center border-gray-200 w-full">
        <thead>
          <tr className="[&_th]:border [&_th]:border-gray-200 px-2">
            <th>
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                onChange={toggleAllCheckboxes}
                checked={selectedIds.length === data.length && data.length > 0}
              />
            </th>
            <th className="font-semibold">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(h => (
              <tr key={h.id} className="cursor-pointer [&_td]:border [&_td]:border-gray-200 [&_td]:px-2">
                <td>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    value={h.id}
                    checked={selectedIds.includes(h.id)}
                    onChange={() => toggleCheckbox(h.id)}
                  />
                </td>
                <td onClick={() => onRowClick?.(h.ip_address)} className="border border-gray-200 hover:bg-gray-200 px-2">
                  {h.ip_address}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center border border-gray-200 px-2">
                No history yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {links && links.length > 0 && fetchPage && (
        <div className="mt-4 flex justify-center space-x-1">
          {links.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              className={`rounded border px-3 py-1 text-xs ${link.active ? "bg-black text-white" : "bg-white hover:bg-gray-100"} ${!link.url ? "cursor-not-allowed opacity-50" : ""}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
              onClick={() => link.url && fetchPage(link.url)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Table;
