import { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import DatasetIcon from '@mui/icons-material/Dataset';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  MRT_ActionMenuItem,
} from 'material-react-table';
import { format } from 'date-fns';
const apiUrl = import.meta.env.VITE_API_URL;

type UserApiResponse = {
  data: Array<User>;
  meta: { totalRowCount: number; };
};

type User = {
  ppen: string;
  tosen: string;
  ppes: string;
  toses: string;
  timestamp: string;
  appName: string;
  APPCorp: string;
  MPP270: string;
  NLLP2021: string;
  gdpr: string;
};

const CorpusView = () => {
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10, });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL(`${apiUrl}/api/corpusView`, location.origin);
      url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`,);
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
      { accessorKey: 'appName', header: 'Nombre', },
      { accessorKey: 'ppen', header: 'PP Eng', },
      { accessorKey: 'ppes', header: 'PP Esp', },
      {
        accessorKey: 'tosen',
        header: 'TOS Eng',
      },
      {
        accessorKey: 'toses',
        header: 'TOS Esp',
      },
      {
        accessorKey: 'APPCorp.stat',
        header: 'APPCorp',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return `${value.toFixed(2)}%`;
        },        
      },
      {
        accessorKey: 'MPP270.stat',
        header: 'MPP270',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return `${value.toFixed(2)}%`;
        },
      },
      {
        accessorKey: 'NLLP2021.stat',
        header: 'NLLP2021',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return `${value.toFixed(2)}%`;
        },        
      },
      {
        accessorKey: 'gdpr.stat',
        header: 'GDPR',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => {
      const gdprFile = row.original.gdpr?.file; // Safely access MPP270.file
      const mppFile = row.original.MPP270?.file; // Safely access MPP270.file
      const appCorpFile = row.original.APPCorp?.file; // Safely access APPCorp.file
      const nllpFile = row.original.NLLP2021?.file; // Safely access APPCorp.file

      return [
        <MRT_ActionMenuItem
          icon={<DatasetIcon />}
          key="GDPR"
          label="GDPR"
          onClick={() => navigate(`/datasetJson?f=${encodeURIComponent(gdprFile)}`)}
          table={table}
        />,
        mppFile && (
          <MRT_ActionMenuItem
            icon={<DatasetIcon />}
            key="MPP270"
            label="MPP270"
            onClick={() => navigate(`/datasetJson?f=${encodeURIComponent(mppFile)}`)}
            table={table}
          />
        ),
        appCorpFile && (
          <MRT_ActionMenuItem
            icon={<DatasetIcon />}
            key="APPCorp"
            label="APPCorp"
            onClick={() => navigate(`/datasetJson?f=${encodeURIComponent(appCorpFile)}`)}
            table={table}
          />
        ),
        <MRT_ActionMenuItem
          icon={<DatasetIcon />}
          key="NLLP2021"
          label="NLLP2021"
          onClick={() => navigate(`/datasetJson?f=${encodeURIComponent(nllpFile)}`)}
          table={table}
        />,
      ];
    }, 
    enableRowSelection: false,
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
          <Typography>Hiper: {JSON.stringify(row.original.ppen, null, 2)}</Typography>
          <Typography>Hiper: {JSON.stringify(row.original.tosen, null, 2)}</Typography>
        </Box>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

export default CorpusView;
