import { useEffect, useMemo, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { format } from 'date-fns';
import {
  Chart as ChartJS, ScatterController,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line, Doughnut, Scatter} from 'react-chartjs-2';
import FieldDisplay from '../utils/fieldDisplay'; "../utils/fieldDisplay"


// Register necessary Chart.js components
ChartJS.register(ScatterController, LinearScale, PointElement, Tooltip, Legend);

// Register necessary components
ChartJS.register(
  ArcElement,    // Required for Doughnut/Pie charts
  LineElement,   // Required for Line charts
  PointElement,  // Required for plotting points on Line charts
  CategoryScale, // X-axis for Line charts
  LinearScale,   // Y-axis for Line charts
  Title,         // Optional for chart titles
  Tooltip,       // Tooltip support
  Legend         // Legend display
);



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
      { accessorKey: 'algorithm', header: 'Algoritmo', },
      {
        accessorKey: 'corpus',
        header: 'Corpus',
      },
      {
        accessorKey: 'user',
        header: 'User',
      },
      { accessorKey: 'result.accuracy', header: 'Accuracy',
        Cell: ({ cell }) => { const accuracy = cell.getValue<number>(); return `${(accuracy * 100).toFixed(2)}%`; },
      },
      { accessorKey: 'result.precision', header: 'Precision',
        Cell: ({ cell }) => { const precision = cell.getValue<number>(); return `${(precision * 100).toFixed(2)}%`; },
      },
      { accessorKey: 'result.recall', header: 'Recall',
        Cell: ({ cell }) => { const recall = cell.getValue<number>(); return `${(recall * 100).toFixed(2)}%`; },
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
          // return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm:ss');
          return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd');
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
      row.original.result ? (
        <Box className="detailpanel"
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            width: '100%',
          }}
        >
          <box className="jsonvalues">
            {/* Render JSON values */}
            <Typography variant="subtitle1">Results:</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <FieldDisplay label="Balanced Accuracy" value={row.original.result.balanced_accy} />
              <FieldDisplay label="Cohen Cappa" value={row.original.result.cohen_kappa} />
              <FieldDisplay label="F1" value={row.original.result.f1} />
              <FieldDisplay label="F2" value={row.original.result.f2} />
              <FieldDisplay label="Mcc" value={row.original.result.mcc} />
              <FieldDisplay label="Time" value={row.original.result.time} />
            </Box>
            </Typography>   
            <Typography variant="subtitle1">Hiperparameters:</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <FieldDisplay label="Vocabulario" value={row.original.hiper.num_distinct_words} />
              <FieldDisplay label="Epochs" value={row.original.hiper.numEpochs} />
              <FieldDisplay label="Batch size" value={row.original.hiper.batchSize} />
              <FieldDisplay label="Embeddings" value={row.original.hiper.embeddings?.type} />
              <FieldDisplay label="InitLr" value={row.original.hiper.initLr} />
              <FieldDisplay label="Smote" value={row.original.hiper.smote} />
              <FieldDisplay label="Data augmentation" value={row.original.hiper.augment} />
              <FieldDisplay label="Activation" value={row.original.hiper.activation} />
              <FieldDisplay label="Output Dim" value={row.original.hiper.output_dim} />
              <FieldDisplay label="Hidden Dim" value={row.original.hiper.hiddenDim} />
              <FieldDisplay label="Dropout" value={row.original.hiper.dropout} />
              <FieldDisplay label="Pooling Layer" value={row.original.hiper.poolingLayer} />
              <FieldDisplay label="Layer Normalization" value={row.original.hiper.layerNorm} />
            </Box>
            </Typography>
          </box>
    
          {/* Conditionally render the charts */}
          {row.original.result?.lossAccuracy && (
            <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {/* Loss and Accuracy Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Loss and Accuracy Over Epochs
                </Typography>
                <Line
                  data={{
                    labels: Array.from({ length: row.original.result.lossAccuracy.epochs }, (_, i) => i + 1),
                    datasets: [
                      {
                        label: 'Train Loss',
                        data: row.original.result.lossAccuracy.trainLosses,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                      },
                      {
                        label: 'Eval Loss',
                        data: row.original.result.lossAccuracy.evalLosses,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                      },
                      {
                        label: 'Eval Accuracy',
                        data: row.original.result.lossAccuracy.evalAccuracies,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Epoch',
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Value',
                        },
                      },
                    },
                  }}
                />
              </Box>
    
              {/* Confusion Matrix */}
              <Box className="confusionmatrix">                
                <Typography variant="h6" gutterBottom>
                  Confusion Matrix
                </Typography>
                <Box                
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${row.original.result.classes_predicted.length + 1}, auto)`,
                    gap: 1,
                    textAlign: 'center',
                  }}
                >
                  {/* Axis Labels */}
                  <Box></Box>
                  {row.original.result.classes_predicted.map((className, i) => (
                    <Box key={`x-axis-${i}`} sx={{ fontWeight: 'bold' }}>
                      {className}
                    </Box>
                  ))}
                  {row.original.result.conf_matrix.map((rowValues, rowIndex) => (
                    <>
                      <Box key={`y-axis-${rowIndex}`} sx={{ fontWeight: 'bold' }}>
                        {row.original.result.classes_predicted[rowIndex]}
                      </Box>
                      {rowValues.map((value, colIndex) => (
                        <Box
                          key={`conf-value-${rowIndex}-${colIndex}`}
                          sx={{
                            backgroundColor: `rgba(75, 192, 192, ${value / Math.max(...rowValues)})`,
                            color: value > Math.max(...rowValues) / 2 ? '#fff' : '#d1d1d1',
                            border: '1px solid #ccc',
                            padding: '0 rem',
                          }}
                        >
                          {value}
                        </Box>
                      ))}
                    </>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ) : null,
    
  });

  return <MaterialReactTable table={table} />;
};

export default DeepMountain;
