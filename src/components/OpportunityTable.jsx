import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export default function OpportunityTable({
  data = [],
  onSelectOpportunity,
  pageSize = 10,
  isLoading = false,
  isError = false
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize
  });

  // Reset to first page when underlying data changes (e.g. after search/filter)
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        id: 'name',
        accessorFn: (row) => row.name || row.title || '',
        header: 'Project Name',
        meta: { align: 'left', width: '28%' },
        cell: (info) => (
          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
            {info.getValue()}
          </span>
        )
      },
      {
        accessorKey: 'source',
        header: 'Source',
        meta: { align: 'left', width: '12%' },
        cell: (info) => info.getValue() || '—'
      },
      {
        accessorKey: 'sector',
        header: 'Sector',
        meta: { align: 'left', width: '12%' },
        cell: (info) => info.getValue() || '—'
      },
      {
        id: 'location',
        accessorFn: (row) => row.location || row.country || '',
        header: 'Location',
        meta: { align: 'left', width: '14%' },
        cell: (info) => info.getValue() || '—'
      },
      {
        id: 'aiScore',
        accessorFn: (row) => Number(row.aiScore ?? row.overallScore ?? 0),
        header: 'AI Score',
        meta: { align: 'center', width: '9%' },
        cell: (info) => {
          const score = info.getValue();
          return (
            <span
              className="badge badge-info"
              style={{ fontSize: '0.8rem', fontWeight: '700' }}
            >
              {typeof score === 'number' ? score.toFixed(1) : score}
            </span>
          );
        }
      },
      {
        accessorKey: 'deadline',
        header: 'Deadline',
        meta: { align: 'center', width: '11%' },
        cell: (info) => (
          <span style={{ whiteSpace: 'nowrap' }}>
            {info.getValue() || '—'}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { align: 'center', width: '8%' },
        cell: (info) => {
          const val = info.getValue() || 'New';
          const badgeClass =
            val.toLowerCase() === 'pursued'
              ? 'badge-new'
              : val.toLowerCase() === 'declined'
              ? 'badge-priority'
              : 'badge-new';
          return <span className={`badge ${badgeClass}`}>{val}</span>;
        }
      },
      {
        id: 'action',
        header: 'Action',
        meta: { align: 'center', width: '6%' },
        cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: '0.35rem 0.5rem',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px'
            }}
            onClick={() => onSelectOpportunity?.(row.original)}
            title={`View ${row.original.name || row.original.title || 'opportunity'}`}
            aria-label={`View ${row.original.name || row.original.title || 'opportunity'}`}
          >
            <Eye size={13} />
          </button>
        )
      }
    ],
    [onSelectOpportunity]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const totalCount = data.length;
  const pageIndex = pagination.pageIndex;
  const currentPageSize = pagination.pageSize;
  const startRow = totalCount === 0 ? 0 : pageIndex * currentPageSize + 1;
  const endRow = Math.min((pageIndex + 1) * currentPageSize, totalCount);
  const pageCount = table.getPageCount();

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-container" style={{ border: 'none', overflowX: 'auto', overflowY: 'visible' }}>
        <table className="data-table" style={{ width: '100%', tableLayout: 'auto' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align || 'left';
                  const width = header.column.columnDef.meta?.width;

                  return (
                    <th
                      key={header.id}
                      style={{
                        textAlign: align,
                        width: width,
                        padding: '0.75rem 0.875rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}
                >
                  Loading opportunities...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--danger-text, #ef4444)' }}
                >
                  Failed to load opportunities. Please try again.
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}
                >
                  No opportunities match your filter criteria.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align || 'left';
                    return (
                      <td
                        key={cell.id}
                        style={{
                          textAlign: align,
                          padding: '0.75rem 0.875rem',
                          verticalAlign: 'middle'
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          Showing {startRow} to {endRow} of {totalCount} entries
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              opacity: !table.getCanPreviousPage() ? 0.4 : 1,
              cursor: !table.getCanPreviousPage() ? 'not-allowed' : 'pointer'
            }}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous Page"
          >
            &lt;
          </button>

          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`btn ${pageIndex === i ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', minWidth: '1.75rem' }}
              onClick={() => table.setPageIndex(i)}
              aria-label={`Page ${i + 1}`}
              aria-current={pageIndex === i ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            className="btn btn-outline"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              opacity: !table.getCanNextPage() ? 0.4 : 1,
              cursor: !table.getCanNextPage() ? 'not-allowed' : 'pointer'
            }}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next Page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
