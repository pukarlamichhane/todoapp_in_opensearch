import React, { useEffect, useState } from 'react';

import './table.scss';
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
} from '@elastic/eui';

import ToastMessage from '../../shared-components/Toast/Toast';
import TableMessage from '../../shared-components/tableMessage/TableMessage';
import Textfield from '../../shared-components/Textfield/Textfield';
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
} from '../../redux/services/todoService';

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

const Table = () => {
  const [todos, settodos] = useState<any>([]);
  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const closeModal = () => setIsDestroyModalVisible(false);
  const [checked, setChecked] = useState(false);
  const [option, setOption] = useState(false);
  const [isloading, setisLoading] = useState(true);
  const [newtitle, setTitle] = useState('');
  const [newdescription, setdescription] = useState('');
  const [Itemdelete, setItemDelete] = useState<number>();
  const [updatetask, setupdatetask] = useState('');
  const [updatedescription, setupdatedescription] = useState('');
  const [allUpdateData, setAllUpdateData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageDesc, setErrorMessageDesc] = useState('');
  const [updateerrorMessage, setUpdateErrorMessage] = useState('');
  const [error, setError] = useState(true);
  const options = [
    { value: 'Low', text: 'Low' },
    { value: 'Medium', text: 'Medium' },
    { value: 'High', text: 'High' },
    { value: 'Critical', text: 'Critical' },
  ];

  const [value, setValue] = useState(options[1].value);

  const Handleaddtask = async () => {
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
      const task = {
        task: newtitle,
        description: newdescription,
        severity: value,
      };

      console.log(task);

      const a = await addtask(task);
      console.log(a);
      setTitle('');
      setdescription('');
      setErrorMessage('');
      setErrorMessageDesc('');
    }
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
    const A = await deletetask(Itemdelete);
    console.log(A);
    settodos(todos.filter((todo: any) => todo.id !== Itemdelete));
    setIsDestroyModalVisible(false);
  };

  const { data, isLoading, isError } = useGetTaskQuery('');

  console.log(data);

  const [addtask] = useAddTaskMutation();
  const [updattask] = useUpdateTaskMutation();
  const [deletetask] = useDeleteTaskMutation();

  const handleEdit = (data: any) => {
    setIsFlyoutVisible(true);
    setupdatetask(data.task);
    setupdatedescription(data.description);
    setChecked(data.complete);
    setOption(data.severity);
    setAllUpdateData(data);
  };

  useEffect(() => {
    if (data) {
      settodos(data);
    }
  }, [data]);

  const handleUpdate = async () => {
    if (updatetask.trim().length !== 0 && updatedescription.trim().length !== 0) {
      if (
        updatetask.length !== updatetask.trim().length ||
        updatedescription.length !== updatedescription.trim().length
      ) {
        setUpdateErrorMessage('Please remove leading or trailing spaces');
      } else {
        const response = {
          id: allUpdateData.id,
          task: updatetask.trim(),
          description: updatedescription.trim(),
          complete: checked,
          severity: option,
        };
        await updattask(response);
        setIsFlyoutVisible(false);
        setErrorMessage('');
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
                  <Textfield
                    passData={updatetask}
                    handlePassData={setupdatetask}
                    placeholder={'Task'}
                  ></Textfield>
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
                  <Textfield
                    passData={updatedescription}
                    handlePassData={setupdatedescription}
                    placeholder={'Description'}
                  ></Textfield>
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
        return (
          <EuiBadge style={{ color: '#fff' }} color={color}>
            {label.toLowerCase()}
          </EuiBadge>
        );
      },
    },
    {
      field: 'severity',
      name: 'Severity',

      render: (serverity: todo['severity']) => {
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

  return (
    <>
      <EuiPage restrictWidth="1000px">
        <EuiPageBody component="main" style={{ gap: '10px' }}>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiForm>
                <EuiFlexGroup direction="column">
                  <EuiFlexItem>
                    <EuiFlexGroup>
                      <EuiFlexItem>
                        <Textfield
                          passData={newtitle}
                          handlePassData={setTitle}
                          placeholder={'Task'}
                        ></Textfield>
                      </EuiFlexItem>

                      <EuiFlexItem>
                        <Textfield
                          passData={newdescription}
                          handlePassData={setdescription}
                          placeholder={'Description'}
                        ></Textfield>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>

                  <EuiFlexItem>
                    <EuiFlexGroup justifyContent="spaceBetween">
                      <EuiFlexItem>
                        <EuiSelect
                          style={{ width: '700px' }}
                          options={options}
                          value={value}
                          onChange={(e) => oChange(e)}
                        />
                      </EuiFlexItem>

                      <EuiFlexItem grow={false}>
                        <EuiButton
                          style={{ width: '100px', fontSize: '15px' }}
                          fill
                          onClick={Handleaddtask}
                        >
                          Add task
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiForm>
            </EuiPageContentBody>

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

          <EuiPageContent>
            <EuiBasicTable
              className="table-table"
              loading={isLoading}
              items={onlineUsers}
              columns={columns}
              noItemsMessage={isLoading || isError ? 'Loading......' : <TableMessage />}
            ></EuiBasicTable>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
      <ToastMessage />
    </>
  );
};

export default Table;
