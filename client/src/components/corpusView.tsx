import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Dialog, DialogContent, DialogTitle, IconButton, CircularProgress, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(false);
  const navigate = useNavigate();


  const handleModalClose = () => setModalOpen(false);

  const handleButtonClick = async (fileUrl: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/file?f=${encodeURIComponent(fileUrl)}`);
      if (response.ok) {
        const text = await response.text();
        setModalContent(text);
        setModalOpen(true);
      } else {
        console.error(`Failed to fetch file content for URL: ${fileUrl}`);
      }
    } catch (error) {
      console.error(`Error fetching file for URL: ${fileUrl}`, error);
    }
  };

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
  }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);

  const handleOpenModal = async (fileUrl: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(false);

    try {
      const response = await fetch(`/file?f=${encodeURIComponent(fileUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      const text = await response.text();
      setModalContent(text);
    } catch (error) {
      setModalError(true);
      console.error(error);
    }
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent('');
  };

  const renderCellWithButton = (handleButtonClick) => ({ cell }) => {
    const { stat, file } = cell.getValue(); // Destructure 'stat' and 'file'
    
    if (stat === 'ok') {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleButtonClick(file)}
        >
          OK
        </Button>
      );
    }
    
    return stat; // Return 'stat' value if not 'ok'
  };
  
  
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'appName', header: 'APK', },
      { accessorKey: 'ppen', header: 'PP Eng', Cell: renderCellWithButton(handleButtonClick) },
      { accessorKey: 'ppes', header: 'PP Esp', Cell: renderCellWithButton(handleButtonClick) },
      { accessorKey: 'tosen', header: 'TOS Eng', Cell: renderCellWithButton(handleButtonClick) },
      { accessorKey: 'toses', header: 'TOS Esp', Cell: renderCellWithButton(handleButtonClick) },
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

  return (
    <>
      <MaterialReactTable table={table} />
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          File Content
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {modalLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : modalError ? (
            <Typography color="error">Failed to load content</Typography>
          ) : (
            <Typography component="pre">{modalContent}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CorpusView;
