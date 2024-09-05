import React, { useState } from 'react';
import { EuiGlobalToastList } from '@elastic/eui';
let addToastHandler: any;
let removeAllToastsHandler: any;
let toastId = 0;
export function addToast() {
  addToastHandler();
}
export function removeAllToasts() {
  removeAllToastsHandler();
}
const ToastMessage = () => {
  const [toasts, setToasts] = useState([]);
  addToastHandler = () => {
    const toast: any = getRandomToast();
    setToasts(toasts.concat(toast));
  };
  const removeToast = (removedToast: any) => {
    setToasts((toasts) => toasts.filter((toast: any) => toast.id !== removedToast.id));
  };
  removeAllToastsHandler = () => {
    setToasts([]);
  };
  const getRandomToast = () => {
    const toasts = [
      {
        title: 'Todo Update Sucessfully!',
        color: 'success',
        text: <p>Thanks for your patience!</p>,
      },
    ];
    return {
      id: `toast${toastId++}`,
      ...toasts[Math.floor(Math.random() * toasts.length)],
    };
  };
  return (
    <div className="toast">
      <EuiGlobalToastList toasts={toasts} dismissToast={removeToast} toastLifeTimeMs={6000} />
    </div>
  );
};

export default ToastMessage;
