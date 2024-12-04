import { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { format } from 'date-fns';

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  algorithm: string;
  corpus: string;
  lang: string;
  stat: string;
  timestamp: string;
  hiper: string;
};

const DeepMountain = () => {
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL('http://10.201.54.162:5000/api/dataDeep', location.origin);
      url.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      try {
        const response = await fetch(url.href);
        const json = (await response.json()) as UserApiResponse;
        setData(json.data);
        setRowCount(json.meta.totalRowCount);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'algorithm',
        header: 'Algoritmo',
      },
      {
        accessorKey: 'corpus',
        header: 'Corpus',
      },
      {
        accessorKey: 'user',
        header: 'User',
      },
      {
        accessorKey: 'result.accuracy',
        header: 'Accuracy',
        Cell: ({ cell }) => {
          const accuracy = cell.getValue<number>();
          return `${(accuracy * 100).toFixed(2)}%`;
        },
      },
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        Cell: ({ cell }) => {
          const timestamp = cell.getValue() as string;

          // Parse the timestamp format "yyyyMMddHHmmss"
          const year = parseInt(timestamp.slice(0, 4), 10);
          const month = parseInt(timestamp.slice(4, 6), 10) - 1; // Months are zero-indexed
          const day = parseInt(timestamp.slice(6, 8), 10);
          const hour = parseInt(timestamp.slice(8, 10), 10);
          const minute = parseInt(timestamp.slice(10, 12), 10);
          const second = parseInt(timestamp.slice(12, 14), 10);

          const date = new Date(year, month, day, hour, minute, second);
          return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm:ss');
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.timestamp,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row.original.algorithm ? (
        <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          <Typography>Hiper: {JSON.stringify(row.original.result, null, 2)}</Typography>
          <Typography>Hiper: {JSON.stringify(row.original.hiper, null, 2)}</Typography>
        </Box>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

export default DeepMountain;
