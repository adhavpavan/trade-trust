import React, { useEffect, useState } from 'react';
import { Grid, Form, Pagination, Segment } from 'semantic-ui-react'
// import ReactPaginate from 'react-paginate';
import { DEFAULT_PAGINATION_CONFIGURATION } from '../utils/Constants';

export default function Paginate(props) {
    props = { ...DEFAULT_PAGINATION_CONFIGURATION, ...props }
    console.log("Default pagination configuration", props);

    return <div>
        <Grid columns={1}>
            <Grid.Column>
                <Pagination
                    activePage={props.activePage}
                    boundaryRange={props.boundaryRange}
                    onPageChange={(e, data) => props.handlePaginationClick(e, data.activePage)}
                    size='mini'
                    siblingRange={props.siblingRange}
                    totalPages={props.totalPages}
                    // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                    ellipsisItem={props.showEllipsis ? undefined : null}
                    firstItem={props.showFirstAndLastNav ? undefined : null}
                    lastItem={props.showFirstAndLastNav ? undefined : null}
                    prevItem={props.showPreviousAndNextNav ? undefined : null}
                    nextItem={props.showPreviousAndNextNav ? undefined : null}
                />
            </Grid.Column>
        </Grid>
    </div>;
}
