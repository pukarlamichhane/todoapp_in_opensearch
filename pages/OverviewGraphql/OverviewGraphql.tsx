import React, { useEffect, useState } from 'react';
import { Axis, BarSeries, Chart, Partition, Position, ScaleType, Settings } from '@elastic/charts';
import {
  EuiPage,
  EuiPageBody,
  EuiFlexGrid,
  EuiFlexItem,
  EuiPageContent,
  EuiSpacer,
  EuiTitle,
  EuiSuperDatePicker,
} from '@elastic/eui';
import './overviewGraphql.scss';
import { useGetGraphqlAggMutation } from '../../redux/services/graphqlService';

interface DataItem {
  key: string;
  doc_count: number;
}

const OverviewGraphql: React.FC = () => {
  const [startDate, setStartDate] = useState('now-30d');
  const [endDate, setEndDate] = useState('now');
  const [datas, setData] = useState<DataItem[]>([]);

  const onTimeChange = ({ start, end }: { start: string; end: string }) => {
    setStartDate(start);
    setEndDate(end);
  };

  const [adddate] = useGetGraphqlAggMutation();

  const fetch = async () => {
    try {
      const response = await adddate({ startDate, endDate });

      console.log(response);
      if ('data' in response) {
        // setData(response.data);
        setData(response.data?.data.getdate || []); // Assuming `getdate` is the correct data path
      } else if ('error' in response) {
        console.error('An error occurred:', response.error);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetch();
  }, [startDate, endDate]); // Removed adddate from dependency array to avoid unnecessary re-fetches

  const STATUS_DATA = datas.map((data) => ({
    status: data.key,
    count: data.doc_count,
  }));

  const chartData = datas.map((data) => ({
    x: data.key,
    y: data.doc_count,
  }));

  const chartBaseTheme = {
    colors: {
      vizColors: ['#DC0A0A', '#F06939', '#EDA312', '#1C7A4A'],
    },
  };

  return (
    <EuiPage className="overview" restrictWidth="1000px">
      <EuiPageBody className="overview-body">
        <div className="overview-date">
          <EuiSuperDatePicker
            className="overview-datepicker"
            start={startDate}
            end={endDate}
            onTimeChange={onTimeChange}
            showUpdateButton={true}
          />
        </div>

        <EuiFlexGrid columns={2} className="overview-flex">
          <EuiFlexItem>
            <EuiPageContent>
              <EuiTitle className="eui-textCenter" size="xs">
                <h3>Severity</h3>
              </EuiTitle>
              <EuiSpacer />
              <Chart size={{ height: 250 }} className="overview-pie">
                <Settings showLegend={true} showLegendExtra legendMaxDepth={1} tooltip="none" />
                <Partition
                  id="pieByPR"
                  data={STATUS_DATA}
                  valueAccessor={(d) => d.count}
                  layers={[
                    {
                      groupByRollup: (d: any) => d.status,
                      shape: {
                        fillColor: (_, sortIndex) =>
                          chartBaseTheme.colors.vizColors[
                            sortIndex % chartBaseTheme.colors.vizColors.length
                          ],
                      },
                      fillLabel: {
                        valueFormatter: () => '',
                        maxFontSize: 2, // Hide all labels
                      },
                    },
                  ]}
                />
              </Chart>
            </EuiPageContent>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiPageContent>
              <Chart size={['100%', 250]} className="overview-bar">
                <Settings />
                <Axis id="count" title="Events" position={Position.Left} />
                <Axis id="x" title="Severity" position={Position.Bottom} />
                <BarSeries
                  id="bars"
                  xScaleType={ScaleType.Ordinal}
                  xAccessor="x"
                  yAccessors={['y']}
                  data={chartData}
                />
              </Chart>
            </EuiPageContent>
          </EuiFlexItem>
        </EuiFlexGrid>
      </EuiPageBody>
    </EuiPage>
  );
};

export default OverviewGraphql;
