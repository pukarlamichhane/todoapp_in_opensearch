// import { EuiIcon } from '@elastic/eui';
import React from 'react';
import './TableMessage.scss';

const TableMessage = () => {
  return (
    <div className="tablemessage">
      {/* <EuiIcon className="tablemessage-icon" type="alert" /> */}
      <h2 className="tablemessage-tittle">You have no table data</h2>
      <p className="tablemessage-paragraph1">
        There seems to be no data available for take server at the moment.
      </p>
      <p className="tablemessage-paragraph2">You'll need to add some data</p>
    </div>
  );
};

export default TableMessage;
