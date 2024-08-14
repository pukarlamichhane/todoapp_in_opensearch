import React, { useState } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
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
} from '@elastic/eui';
import ToastMessage from './toast';
import { addToast } from './toast';

interface TodoappAppDeps {
  basename: string;
}

interface todo {
  id: number;
  task: string;
  description: string;
  complete: boolean;
}

export const TodoappApp = ({ basename }: TodoappAppDeps) => {
  const [todos, settodos] = useState<any>([]);
  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const closeModal = () => setIsDestroyModalVisible(false);
  const [checked, setChecked] = useState(false);
  const [update, setUpdate] = useState<any>({});
  const [newtitle, setTitle] = useState('');
  const [newdescription, setdescription] = useState('');
  const [Itemdelete, setItemDelete] = useState<number>();
  const [updatetask, setupdatetask] = useState('');
  const [updatedescription, setupdatedescription] = useState('');
  const [allUpdateData, setAllUpdateData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageDesc, setErrorMessageDesc] = useState('');
  const [updateerrorMessage, setUpdateErrorMessage] = useState('');

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
      const newtask = {
        id: todos.length + 1,
        task: newtitle,
        description: newdescription,
        complete: false,
      };

      settodos([...todos, newtask]);
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

  const updateTodos = (id: any) => {
    setUpdate(id);
    setIsFlyoutVisible(true);
  };
  const deleteTodos = (id: number) => {
    setItemDelete(id);
  };

  const DTodos = () => {
    settodos(todos.filter((todo: any) => todo.id !== Itemdelete));
    setIsDestroyModalVisible(false);
  };

  const handleEdit = (data: any) => {
    setIsFlyoutVisible(true);
    setupdatetask(data.task);
    setupdatedescription(data.description);
    setChecked(data.complete);
    setAllUpdateData(data);
  };

  const handleUpdate = () => {
    if (updatetask.trim().length !== 0 && updatedescription.trim().length !== 0) {
      if (
        updatetask.length !== updatetask.trim().length ||
        updatedescription.length !== updatedescription.trim().length
      ) {
        setUpdateErrorMessage('Please remove leading or trailing spaces');
      } else {
        const updatednewdata = todos.map((item: any) =>
          item.id === allUpdateData.id
            ? {
                ...item,
                task: updatetask.trim(),
                description: updatedescription.trim(),
                complete: checked,
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
  console.log(todos, 'this is old all data............');
  console.log(allUpdateData, 'this is all updated data....');
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth="1000px">
            <EuiPageBody component="main">
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

                      <EuiFlexItem
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                        }}
                      >
                        <EuiButton style={{ width: '100px' }} onClick={addtask}>
                          Add task
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiForm>
                </EuiPageContentBody>
                <EuiBasicTable items={todos} columns={columns}></EuiBasicTable>
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
        </>
      </I18nProvider>
    </Router>
  );
};
