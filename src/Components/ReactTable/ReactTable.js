import React from 'react';
import styled from 'styled-components';
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    usePagination,
    useSortBy,
    useExpanded,
    useResizeColumns,
    // useFlexLayout,
} from 'react-table';

// Components
import { InputAdornment, TextField } from '@material-ui/core';
import {
    // Button, 
    Col,
    Row
} from 'reactstrap';
import { Pagination } from '../../Components/Pagination';
// import OptionsOutsideSelect from '../../tables/table-tools/Filters/Selectors/OptionsOutsideSelect';
// import Spinner from '../../../components/Spinner';

// Icons
import {
    // CaretDown, 
    // CaretUp, 
    // CaretRight, 
    Search,
    // XSquareFill, 
    // ArrowLeftRight 
} from 'react-bootstrap-icons';

// Utilities
// import { matchSorter } from 'match-sorter';
import { numberFormatter } from './numberFormatter';
import {
    // makeStyles, 
    // Tooltip 
} from '@material-ui/core';

const Styles = styled.div`
    div.bottom-actions {
        display: flex;
        justify-content: flex-start;
        margin-left: 1%;
    }
    div#global-filter-container > div.col {
        display: flex;
        justify-content: flex-end;
    }
    div.pagination {
        display: flex;
        align-self: center;
        justify-content: flex-end;
        max-height: 25px;
        margin-right: 1%;
    }
    table {
        width: 100%;
        border-spacing: 0;
        border: none;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        table-layout: fixed;
        
        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
            :hover {
                background-color: #f8f9fa;
            }
        }
        
        th {
            background-color: #2c3e50;
            color: white;
            font-weight: 500;
            padding: 8px 12px;
            text-align: left;
            font-size: 0.85rem;
            letter-spacing: 0.3px;
            border: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
            color: #2c3e50;
            font-size: 0.85rem;
            white-space: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            min-width: 0;
            max-width: 100%;
            line-height: 1.4;
        }

        td:first-child {
            white-space: nowrap;
            width: 150px;
        }
        
        .resizer {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            width: 2px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            transform: translateX(50%);
            z-index: 1;
            touch-action: none;
            
            &.isResizing {
                background: #2c3e50;
            }
        }
    }
`;

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
    const count = preFilteredRows.length;

    return (
        <input
            style={{ width: '100%', backgroundColor: 'rgb(251 251 251)', }}
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
}

// const utilButtons = {
//     backgroundColor: '#727cf5',
// };

// const useStyles = makeStyles({
//     underline: {
//         '&&&:before': {
//             borderBottom: 'none',
//         },
//         '&&:after': {
//             borderBottom: 'none',
//         },
//     },
//     card: {
//         borderRadius: '10px',
//     },
//     container: {
//         backgroundColor: 'white',
//         width: '100%',
//         display: 'flex',
//         justifyContent: 'center',
//         borderRadius: '10px',
//     },
//     body: {
//         // minHeight: '300px',
//         width: '100%',
//         alignSelf: 'center',
//         zoom: '80%',
//     },
//     filterButton: {
//         display: 'flex',
//         alignSelf: 'center',
//         backgroundColor: 'white',
//         height: 'auto',
//         borderRadius: '5px',
//         boxShadow: '1px 1px 1px 1px black',
//         cursor: 'pointer',
//         '&:hover': {
//             opacity: '0.8',
//         },
//         '&:active': {
//             border: '1px inset gray',
//             boxShadow: 'none',
//             transform: 'translateY(4px)',
//         },
//     },
// });

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    // const classes = useStyles();

    return (
        <>
            {/* Search Table:{' '}  */}
            <TextField
                variant="outlined"
                size="small"
                value={value || ''}
                // label={`Search Table: ${count} records...`}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                // Appends the Search Icon within the Input
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <Search style={{ color: 'gray' }} />
                        </InputAdornment>
                    ),
                    // classes,
                }}
                placeholder={`${count} records...`}
            />
        </>
    );
}

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer
const ReactTable = ({
    columns = [],
    data = [],
    renderRowSubComponent,
    defaultPageSize,
    maxHeight,
    DropdownDetails,
}) => {
    const ExpandCards = DropdownDetails;

    let originalDataLength = data.length;

    // function fuzzyTextFilterFn(rows, id, filterValue) {
    //     let match = matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
    //     originalDataLength = match.length;
    //     return match;
    // }

    // Let the table remove the filter if the string is empty
    // fuzzyTextFilterFn.autoRemove = (val) => {
    //     if (!val) {
    //         setTimeout(() => {
    //             originalDataLength = data.length;
    //         }, [1]);
    //     }
    //     return !val;
    // };

    // const filterTypes = React.useMemo(
    //     () => ({
    //         // Add a new fuzzyTextFilterFn filter type.
    //         fuzzyText: fuzzyTextFilterFn,
    //         // Or, override the default text filter to use
    //         // "startWith"
    //         text: (rows, id, filterValue) => {
    //             return rows.filter((row) => {
    //                 const rowValue = row.values[id];
    //                 return rowValue !== undefined
    //                     ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
    //                     : true;
    //             });
    //         },
    //     }),
    //     [columns]
    // );

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            minWidth: 115,
            // width: testNum > 75 ? testNum : 300,
            width: 250,
            maxWidth: 300,
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        // rows,
        page,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // setHiddenColumns,
        // resetResizing,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            // filterTypes,
            initialState: { pageIndex: 0, pageSize: defaultPageSize ? defaultPageSize : 20 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded, // We can useExpanded to track the expanded state
        usePagination,
        // useFlexLayout,
        useResizeColumns
    );

    const hiddenIndexes = [];

    let scroll = {
        overflowX: 'auto',
        overflowY: 'auto',
        margin: '8px',
        borderRadius: '8px',
        backgroundColor: 'white',
        maxHeight: maxHeight,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    };

    return (
        <>
            <Row id="global-filter-container">
                <Row style={{ marginLeft: '.02rem' }}>
                    <Col xl={10}>
                        <select
                            className="page-select form-select"
                            style={{
                                marginRight: '1vw',
                                marginTop: '.5vw',
                                width: '7rem',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                padding: '8px',
                                fontSize: '0.9rem'
                            }}
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col xl={2} className='align-items-end'>
                        <GlobalFilter
                            style={{}}
                            width={'5rem'}
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </Col>
                </Row>
            </Row>
            <div style={scroll}>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, i) => {
                                    return (
                                        <th {...column.getHeaderProps()}>{
                                            column.render('Header')}
                                            {/* {console.log('Header', typeof column.Header, column.Header)} */}
                                            {/* <div className='column-filter'>
                                                    {typeof column.Header === 'string' && column.Header !== 'Action' ? column.render('Filter'): <></>}
                                                </div> */}
                                        </th>);
                                }
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                // Use a React.Fragment here so the table markup is still valid
                                <React.Fragment key={row.getRowProps().key}>
                                    <tr>
                                        {row.cells.map((cell, i) => {
                                            if (hiddenIndexes.includes(i)) {
                                                return (
                                                    <td className="hidden" {...cell.getCellProps()}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            } else {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                            }
                                        })}
                                    </tr>
                                    {/*
                                    If the row is in an expanded state, render a row with a
                                    column that fills the entire length of the table.
                                    */}
                                    {row.isExpanded ? (
                                        <tr>
                                            <td colSpan={visibleColumns.length}>
                                                {React.cloneElement(ExpandCards, {
                                                    id: row.values['campaign_id'],
                                                })}
                                                {/*
                                                Inside it, call our renderRowSubComponent function. In reality,
                                                you could pass whatever you want as props to
                                                a component like this, including the entire
                                                table instance. But for this example, we'll just
                                                pass the row
                                                */}

                                                {/* {renderRowSubComponent({ row })} */}
                                            </td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <br />
            <Row>
                <Col className="bottom-actions">
                    <span className="page-info">
                        Showing <>{numberFormatter(page.length)} </>
                        records filtered from {numberFormatter(originalDataLength)}
                    </span>
                </Col>

                <Col className="pagination">
                    <Pagination
                        viewModal={false}
                        canPreviousPage={canPreviousPage}
                        canNextPage={canNextPage}
                        pageOptions={pageOptions}
                        pageCount={pageCount}
                        gotoPage={gotoPage}
                        nextPage={nextPage}
                        previousPage={previousPage}
                        pageIndex={pageIndex}
                        originalDataLength={originalDataLength}
                    />
                </Col>
            </Row>
        </>
    );
};

function App({ columns, data, defaultPageSize = null, maxHeight = '70vh', DropdownDetails }) {
    // Create a function that will render our row sub components
    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
            <pre
                style={{
                    fontSize: '10px',
                }}>
                <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
            </pre>
        ),
        []
    );

    return (
        <Styles>
            <ReactTable
                columns={columns}
                data={data}
                defaultPageSize={defaultPageSize}
                maxHeight={maxHeight}
                // We added this as a prop for our table component
                // Remember, this is not part of the React Table API,
                // it's merely a rendering option we created for
                // ourselves
                DropdownDetails={DropdownDetails}
                renderRowSubComponent={renderRowSubComponent}
            />
        </Styles>
    );
}

export default App;