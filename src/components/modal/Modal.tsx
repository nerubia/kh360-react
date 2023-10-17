import { Button, LinkButton } from "../../components/button/Button"

interface ModalPopupProps {
  show: boolean
  proceed: string
  title?: string
  handleClose: () => void
}

export const ModalPopup = ({
  show,
  title,
  proceed,
  handleClose,
}: ModalPopupProps) => {
  return (
    <>
      {show ? (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
                  <h3 className='text-2xl font-semibold'>{title}</h3>
                </div>
                <div className='relative p-6 flex-auto'>
                  <p className='my-4 text-blueGray-500 text-lg leading-relaxed'>
                    Are you sure you want to cancel and exit? <br />
                    If you cancel, your data won&apos;t be saved.
                  </p>
                </div>
                <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
                  <div className='mr-2'>
                    <Button variant='primary' onClick={handleClose}>
                      No
                    </Button>
                  </div>
                  <LinkButton variant='destructive' to={proceed}>
                    Yes
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
    </>
  )
}

export default ModalPopup
