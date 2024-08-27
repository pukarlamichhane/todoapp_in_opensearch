import React, { useEffect, useState } from 'react';

import RouterT from './RouterT';
import './app.scss';
import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiBadge,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiForm,
  EuiConfirmModal,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiSwitch,
  EuiButtonEmpty,
  EuiSelect,
  EuiSpacer,
} from '@elastic/eui';
import ToastMessage from './toast';
import { addToast } from './toast';
import axios from 'axios';

import { Chart, Partition, Settings, PartitionLayout } from '@elastic/charts';

interface TodoappAppDeps {
  basename: string;
}

interface todo {
  id: number;
  task: string;
  description: string;
  complete: boolean;
  createat: Date;
  updateat: Date;
  status: boolean;
  severity: string;
}

export const TodoappApp = ({ basename }: TodoappAppDeps) => {
  const [todos, settodos] = useState<any>([]);
  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const closeModal = () => setIsDestroyModalVisible(false);
  const [checked, setChecked] = useState(false);
  const [option, setOption] = useState(false);

  const [newtitle, setTitle] = useState('');
  const [newdescription, setdescription] = useState('');
  const [Itemdelete, setItemDelete] = useState<number>();
  const [updatetask, setupdatetask] = useState('');
  const [updatedescription, setupdatedescription] = useState('');
  const [allUpdateData, setAllUpdateData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageDesc, setErrorMessageDesc] = useState('');
  const [updateerrorMessage, setUpdateErrorMessage] = useState('');

  const options = [
    { value: 'Low', text: 'Low' },
    { value: 'Medium', text: 'Medium' },
    { value: 'High', text: 'High' },
    { value: 'Critical', text: 'Critical' },
  ];

  const [value, setValue] = useState(options[1].value);

  const addtask = () => {
    const trimmedTitle = newtitle.trim();
    const trimmedDescription = newdescription.trim();

    if (trimmedTitle.length === 0 && trimmedDescription.length === 0) {
      setErrorMessage('Enter a value for both title and description');
      setErrorMessageDesc('Enter a value for both title and description');
    } else if (trimmedTitle.length === 0) {
      setErrorMessage('Enter a value for title');
      setErrorMessageDesc('');
    } else if (trimmedDescription.length === 0) {
      setErrorMessage('');
      setErrorMessageDesc('Enter a value for description');
    } else if (
      newtitle.length !== trimmedTitle.length ||
      newdescription.length !== trimmedDescription.length
    ) {
      setErrorMessage(
        newtitle.length !== trimmedTitle.length
          ? 'Please remove leading or trailing spaces from title'
          : ''
      );
      setErrorMessageDesc(
        newdescription.length !== trimmedDescription.length
          ? 'Please remove leading or trailing spaces from description'
          : ''
      );
    } else {
      const res = axios.post('http://localhost:3000/api/create', {
        task: newtitle,
        description: newdescription,
        severity: value,
      });
      console.log(res);
      setTimeout(() => {
        fetch();
      }, 1800);
      setTitle('');
      setdescription('');
      setErrorMessage('');
      setErrorMessageDesc('');
    }
  };

  const handleTitleChange = (e: any) => {
    setupdatetask(e.target.value);
  };

  const handledescriptionChange = (e: any) => {
    setupdatedescription(e.target.value);
  };

  const onChange = (e: any) => {
    setChecked(e.target.checked);
  };

  const oChange = (e: any) => {
    setValue(e.target.value);
  };

  const updateOptions = (e: any) => {
    setOption(e.target.value);
  };

  const deleteTodos = (id: number) => {
    setItemDelete(id);
  };

  const DTodos = async () => {
    const res = await axios.delete(`http://localhost:3000/api/delete/${Itemdelete}`);
    console.log(res.data);
    settodos(todos.filter((todo: any) => todo.id !== Itemdelete));
    setIsDestroyModalVisible(false);
  };

  const handleEdit = (data: any) => {
    setIsFlyoutVisible(true);
    setupdatetask(data.task);
    setupdatedescription(data.description);
    setChecked(data.complete);
    setOption(data.severity);
    setAllUpdateData(data);
  };

  const fetch = async () => {
    const response = await axios.get('http://localhost:3000/api/gettodo');
    console.log(JSON.stringify(response.data));
    settodos(response.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleUpdate = async () => {
    if (updatetask.trim().length !== 0 && updatedescription.trim().length !== 0) {
      if (
        updatetask.length !== updatetask.trim().length ||
        updatedescription.length !== updatedescription.trim().length
      ) {
        setUpdateErrorMessage('Please remove leading or trailing spaces');
      } else {
        const response = await axios.put(`http://localhost:3000/api/put/${allUpdateData.id}`, {
          task: updatetask.trim(),
          description: updatedescription.trim(),
          complete: checked,
          severity: option,
        });
        console.log(response);

        const updatednewdata = todos.map((item: any) =>
          item.id === allUpdateData.id
            ? {
                ...item,
                task: updatetask.trim(),
                description: updatedescription.trim(),
                complete: checked,
                severity: option,
              }
            : item
        );

        settodos(updatednewdata);
        setIsFlyoutVisible(false);
        setErrorMessage('');
        addToast();
      }
    } else {
      setUpdateErrorMessage('Both task and description must not be empty');
    }
  };

  let flyout;
  if (isFlyoutVisible) {
    flyout = (
      <EuiFlyout size={'l'} ownFocus onClose={() => setIsFlyoutVisible(false)}>
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2>Update Todo</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody style={{ margin: '30px 70px 0px 70px' }}>
          <EuiFlexGroup direction="column">
            <EuiFlexItem>
              <EuiFlexGroup direction="row" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiTitle size="m">
                    <h2 className="task-tittle">Task</h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFieldText
                    type="text"
                    aria-label="Use aria labels when no actual label is in use"
                    value={updatetask}
                    onChange={(e: any) => handleTitleChange(e)}
                  />
                  {updateerrorMessage && <div className="error-message">{updateerrorMessage}</div>}
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup direction="row" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiTitle size="m">
                    <h2 className="task-tittle">Description</h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFieldText
                    type="text"
                    aria-label="Use aria labels when no actual label is in use"
                    value={updatedescription}
                    onChange={(e: any) => handledescriptionChange(e)}
                  />
                  {updateerrorMessage && <div className="error-message">{updateerrorMessage}</div>}
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup direction="row" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiTitle size="m">
                    <h2 className="task-tittle">Complete</h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiSwitch
                    className="task-switch"
                    label={checked ? 'True' : 'False'}
                    checked={checked}
                    onChange={(e) => onChange(e)}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup direction="row" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiTitle size="m">
                    <h2 className="task-tittle">Serverity</h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiSelect fullWidth options={options} onChange={(e) => updateOptions(e)} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutBody>
        <EuiFlyoutFooter
          style={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <EuiButtonEmpty color="danger" onClick={() => setIsFlyoutVisible(false)}>
            Cancel
          </EuiButtonEmpty>
          <EuiButton color="primary" fill onClick={handleUpdate}>
            Update
          </EuiButton>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'primary';
      case 'High':
        return 'warning';
      case 'Critical':
        return 'danger';
      default:
        return 'default';
    }
  };
  const onlineUsers = todos.filter((todo: todo) => todo.status === false);

  const STATUS_DATA = [
    { status: 'Low', count: 10 },
    { status: 'Medium', count: 20 },
    { status: 'High', count: 30 },
    { status: 'Critical', count: 40 },
  ];

  const columns: Array<EuiBasicTableColumn<todo>> = [
    {
      field: 'task',
      name: 'Task',
    },
    {
      field: 'description',
      name: 'Description',
    },
    {
      field: 'complete',
      name: 'Complete',

      render: (complete: todo['complete']) => {
        const color = complete ? 'success' : 'danger';
        const label = complete ? 'True' : 'False';
        return <EuiBadge color={color}>{label}</EuiBadge>;
      },
    },
    {
      field: 'severity',
      name: 'Severity',

      render: (serverity: todo['severity']) => {
        console.log(serverity);
        const color = severityColor(serverity);
        const label = serverity;
        return <EuiBadge color={color}>{label}</EuiBadge>;
      },
    },
    {
      name: 'Action',
      actions: [
        {
          name: 'Edit',
          description: 'Description',
          type: 'icon',
          icon: 'pencil',
          onClick: (id) => {
            handleEdit(id);
          },
        },
        {
          name: 'Delete',
          description: 'Delete',
          type: 'icon',
          icon: 'trash',
          onClick: ({ id }) => {
            deleteTodos(id);
            setIsDestroyModalVisible(true);
          },
        },
      ],
    },
  ];

  const chartBaseTheme = {
    colors: {
      vizColors: ['#d36086', '#9170b8', '#ca8eae', '#d6bf57'],
    },
  };
  return (
    <>
      <EuiPage restrictWidth="1000px">
        <EuiPageBody component="main" style={{ gap: '10px' }}>
          <EuiPageContent>
            <EuiTitle className="eui-textCenter" size="xs">
              <h3>Severity</h3>
            </EuiTitle>
            <EuiSpacer />
            <Chart size={{ height: 300 }}>
              <Settings showLegend={true} legendMaxDepth={1} />
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
                  },
                ]} // Set this to `true` for normal clockwise sectors
              />
            </Chart>
          </EuiPageContent>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiForm>
                <EuiFlexGroup direction="column">
                  <EuiFlexItem>
                    <EuiFlexGroup>
                      <EuiFlexItem>
                        <EuiFieldText
                          type="text"
                          aria-label="Use aria labels when no actual label is in use"
                          fullWidth
                          placeholder="Task"
                          value={newtitle}
                          onChange={(e: any) => {
                            setTitle(e.target.value);
                          }}
                        />
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                      </EuiFlexItem>

                      <EuiFlexItem>
                        <EuiFieldText
                          type="text"
                          aria-label="Use aria labels when no actual label is in use"
                          fullWidth
                          placeholder="Description"
                          value={newdescription}
                          onChange={(e: any) => {
                            setdescription(e.target.value);
                          }}
                        />
                        {errorMessageDesc && (
                          <div className="error-message">{errorMessageDesc}</div>
                        )}
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>

                  <EuiFlexItem>
                    <EuiFlexGroup justifyContent="spaceBetween">
                      <EuiFlexItem>
                        <EuiSelect
                          style={{ width: '500px' }}
                          options={options}
                          value={value}
                          onChange={(e) => oChange(e)}
                        />
                      </EuiFlexItem>

                      <EuiFlexItem grow={false}>
                        <EuiButton style={{ width: '100px', fontSize: '15px' }} onClick={addtask}>
                          Add task
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiForm>
            </EuiPageContentBody>
            <EuiBasicTable items={onlineUsers} columns={columns}></EuiBasicTable>
            {isDestroyModalVisible && (
              <EuiConfirmModal
                title="Discard dashboard changes?"
                onCancel={closeModal}
                onConfirm={DTodos}
                cancelButtonText="No"
                confirmButtonText="Yes"
                buttonColor="danger"
                defaultFocusedButton="confirm"
              >
                <p>You will lose all unsaved changes made to this dashboard.</p>
              </EuiConfirmModal>
            )}
            {flyout}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
      <ToastMessage />
      <RouterT />
    </>
  );
};
