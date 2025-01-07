import Swal from 'sweetalert2';

export const showSuccessAlert = (message) => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#3085d6',
  });
};

export const showErrorAlert = (message) => {
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};

export const showWarningAlert = (message) => {
  return Swal.fire({
    title: 'Warning!',
    text: message,
    icon: 'warning',
    confirmButtonColor: '#f8bb86',
  });
};

export const showConfirmDialog = async (title, text) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  });
  return result.isConfirmed;
};
