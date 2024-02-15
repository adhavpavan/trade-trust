import React from 'react'

export default function NoDataComponent() {
    return (
        <>
        <Container className="mt--7" fluid>

            <Row>
                <div className="col">
                <ContractView modal={modal} toggle={toggleModal} />
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <h3 className="mb-0">No Data Found</h3>
                        </CardHeader>
                        


                    </Card>
                </div>
            </Row>


        </Container>
    </>
    )
}
