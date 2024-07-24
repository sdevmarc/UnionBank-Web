import { DataGrid, gridClasses } from '@mui/x-data-grid'
import './css/DataGrids.css'

export default function DataGrids({ columnsTest, rowsTest, descCol, colVisibility }) {

    return (
        <DataGrid
            rows={rowsTest}
            columns={columnsTest}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 25,
                    },
                },
                sorting: {
                    sortModel: [{ field: descCol, sort: 'desc' }],
                },
            }}
            getRowHeight={() => 'auto'}
            sx={{
                '& .MuiDataGrid-cell': {
                    borderColor: 'inherit',
                },
                [`& .${gridClasses.cell}`]: {
                    py: 2,
                },
                [`& .${gridClasses.row}:hover`]: {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                [`& .${gridClasses.columnHeader}`]: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: '#cfcfcf',
                },
                [`& .${gridClasses.columnHeaderTitle}`]: {
                    color: 'black',
                },
            }}
            className="data-grid"
            columnVisibilityModel={colVisibility}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
        />
    )
}