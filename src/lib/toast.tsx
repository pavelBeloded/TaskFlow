import { toast } from 'sonner'
import { CustomToast } from '../components/shared/Toast'

export const showToast = {
  success: (message: string) =>
    toast.custom((id) => (
      <CustomToast id={id} type="success" message={message} />
    )),
  error: (message: string) =>
    toast.custom((id) => (
      <CustomToast id={id} type="error" message={message} />
    )),
  info: (message: string) =>
    toast.custom((id) => <CustomToast id={id} type="info" message={message} />),
  warning: (message: string) =>
    toast.custom((id) => (
      <CustomToast id={id} type="warning" message={message} />
    )),
}
