import { useState } from "react"
import { Badge } from "../../components/badge/Badge"
import { Button } from "../../components/button/Button"
import { Icon } from "../../components/icon/Icon"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useTitle } from "../../hooks/useTitle"
import { logout } from "../../redux/slices/authSlice"
import { getProfile, sendMail } from "../../services/api"
import { Alert } from "../../components/alert/Alert"

export default function Sample() {
  useTitle("Sample")

  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const [activePage, setActivePage] = useState("first")

  const handleGetUserProfile = async () => {
    try {
      const response = await getProfile()
      // eslint-disable-next-line no-console
      console.log(response.data)
    } catch (error) {}
  }

  const handleSendMail = async () => {
    try {
      const response = await sendMail()
      // eslint-disable-next-line no-console
      console.log(response.data)
    } catch (error) {}
  }

  const handleLogout = async () => {
    await appDispatch(logout())
  }

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-lg font-bold'>Sample</h1>
      <p>
        Welcome {user?.first_name} {user?.last_name}
      </p>
      <div className='flex gap-2'>
        <Button onClick={handleGetUserProfile}>Get profile</Button>
        <Button onClick={handleSendMail}>Send mail</Button>
        <Button variant='destructive' onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='font-bold'># Sample button variants</p>
        <div className='flex gap-4'>
          <Button size='small'>Small primary</Button>
          <Button size='small' loading={true}>
            Small primary
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button>Medium primary</Button>
          <Button loading={true}>Medium primary</Button>
        </div>
        <div>
          <Button fullWidth>Primary full width</Button>
        </div>
        <div>
          <Button fullWidth loading={true}>
            Primary full width
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='primaryOutline' size='small'>
            Small primary outline
          </Button>
          <Button variant='primaryOutline' size='small' loading={true}>
            Small primary outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='primaryOutline'>Medium primary outline</Button>
          <Button variant='primaryOutline' loading={true}>
            Medium primary outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive' size='small'>
            Small destructive
          </Button>
          <Button variant='destructive' size='small' loading={true}>
            Small destructive
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive'>Medium destructive</Button>
          <Button variant='destructive' loading={true}>
            Medium destructive
          </Button>
        </div>
        <div>
          <Button variant='destructive' fullWidth>
            Destructive full width
          </Button>
        </div>
        <div>
          <Button variant='destructive' fullWidth loading={true}>
            Destructive full width
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructiveOutline' size='small'>
            Small destructive outline
          </Button>
          <Button variant='destructiveOutline' size='small' loading={true}>
            Small destructive outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructiveOutline'>Medium destructive outline</Button>
          <Button variant='destructiveOutline' loading={true}>
            Medium destructive outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='ghost' size='small'>
            Small ghost
          </Button>
          <Button variant='ghost' size='small' loading={true}>
            Medium ghost
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='ghost'>Small ghost</Button>
          <Button variant='ghost' loading={true}>
            Medium ghost
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='font-bold'># Sample badges</p>
        <div className='flex gap-2'>
          <Badge size='small'>Default - Primary</Badge>
          <Badge variant='pink' size='small'>
            Pink
          </Badge>
          <Badge variant='yellow' size='small'>
            Yellow
          </Badge>
          <Badge variant='green' size='small'>
            Green
          </Badge>
          <Badge variant='blue' size='small'>
            Blue
          </Badge>
          <Badge variant='gray' size='small'>
            Gray
          </Badge>
          <Badge variant='greenOutline' size='small'>
            Green outline
          </Badge>
        </div>
        <div className='flex gap-2'>
          <Badge>Default - Primary</Badge>
          <Badge variant='pink'>Pink</Badge>
          <Badge variant='yellow'>Yellow</Badge>
          <Badge variant='green'>Green</Badge>
          <Badge variant='blue'>Blue</Badge>
          <Badge variant='gray'>Gray</Badge>
          <Badge variant='greenOutline'>Green outline</Badge>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='font-bold'># Sample icons</p>
        <div className='flex flex-wrap gap-2'>
          <Icon icon='Check' size='small' />
          <Icon icon='ChevronDown' size='small' />
          <Icon icon='ChevronLeft' size='small' />
          <Icon icon='ChevronRight' size='small' />
          <Icon icon='ChevronsLeft' size='small' />
          <Icon icon='ChevronsRight' size='small' />
          <Icon icon='ChevronUp' size='small' />
          <Icon icon='Close' size='small' />
          <Icon icon='Dashboard' size='small' />
          <Icon icon='Google' size='small' />
          <Icon icon='Logout' size='small' />
          <Icon icon='Menu' size='small' />
          <Icon icon='PenSquare' size='small' />
          <Icon icon='Plus' size='small' />
          <Icon icon='Star' size='small' />
          <Icon icon='Trash' size='small' />
          <Icon icon='UserFill' size='small' />
        </div>
        <div className='flex flex-wrap gap-2'>
          <Icon icon='Check' />
          <Icon icon='ChevronDown' />
          <Icon icon='ChevronLeft' />
          <Icon icon='ChevronRight' />
          <Icon icon='ChevronsLeft' />
          <Icon icon='ChevronsRight' />
          <Icon icon='ChevronUp' />
          <Icon icon='Close' />
          <Icon icon='Dashboard' />
          <Icon icon='Google' />
          <Icon icon='Logout' />
          <Icon icon='Menu' />
          <Icon icon='PenSquare' />
          <Icon icon='Plus' />
          <Icon icon='Star' />
          <Icon icon='Trash' />
          <Icon icon='UserFill' />
        </div>
        <div className='flex flex-wrap gap-2'>
          <Icon icon='Check' size='large' />
          <Icon icon='ChevronDown' size='large' />
          <Icon icon='ChevronLeft' size='large' />
          <Icon icon='ChevronRight' size='large' />
          <Icon icon='ChevronsLeft' size='large' />
          <Icon icon='ChevronsRight' size='large' />
          <Icon icon='ChevronUp' size='large' />
          <Icon icon='Close' size='large' />
          <Icon icon='Dashboard' size='large' />
          <Icon icon='Google' size='large' />
          <Icon icon='Logout' size='large' />
          <Icon icon='Menu' size='large' />
          <Icon icon='PenSquare' size='large' />
          <Icon icon='Plus' size='large' />
          <Icon icon='Star' size='large' />
          <Icon icon='Trash' size='large' />
          <Icon icon='UserFill' size='large' />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='font-bold'># Sample alerts</p>
        <div className='flex flex-col gap-2'>
          <Alert>Primary alert</Alert>
          <Alert variant='success'>Success alert</Alert>
          <Alert variant='destructive'>Error alert</Alert>
        </div>
      </div>

      {/* Evaluation 1 */}
      <div className='flex flex-col gap-4'>
        <p>Evaluation 1</p>
        <div className='w-full lg:w-[800px] flex flex-col gap-4 p-4 shadow-md'>
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <h1 className='text-lg font-medium'>Criteria 1</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                ullam ipsum.
              </p>
            </div>
            <select>
              <option value='#'>Option 1</option>
              <option value='#'>Option 2</option>
              <option value='#'>Option 3</option>
            </select>
          </div>
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <h1 className='text-lg font-medium'>Criteria 2</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                ullam ipsum.
              </p>
            </div>
            <select>
              <option value='#'>Option 1</option>
              <option value='#'>Option 2</option>
              <option value='#'>Option 3</option>
            </select>
          </div>
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <h1 className='text-lg font-medium'>Criteria 3</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                ullam ipsum.
              </p>
            </div>
            <select>
              <option value='#'>Option 1</option>
              <option value='#'>Option 2</option>
              <option value='#'>Option 3</option>
            </select>
          </div>
          <textarea
            className='p-4 border rounded-md'
            cols={30}
            rows={5}
            placeholder='Leave a comment'
          ></textarea>
          <div className='flex justify-end'>
            <Button>Submit</Button>
          </div>
        </div>
      </div>

      {/* Evaluation 2 */}
      <div className='flex flex-col gap-4'>
        <p>Evaluation 2</p>
        <div className='w-full lg:w-[800px] flex flex-col gap-4 p-4 shadow-md'>
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <h1 className='text-lg font-medium'>Criteria 1</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                ullam ipsum.
              </p>
            </div>
            <div>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <h1 className='text-lg font-medium'>Criteria 2</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                ullam ipsum.
              </p>
            </div>
            <div>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <h1 className='text-lg font-medium'>Criteria 3</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                ullam ipsum.
              </p>
            </div>
            <div>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
              <button>
                <Icon icon='Star' />
              </button>
            </div>
          </div>
          <textarea
            className='p-4 border rounded-md'
            cols={30}
            rows={5}
            placeholder='Leave a comment'
          ></textarea>
          <div className='flex justify-end'>
            <Button>Submit</Button>
          </div>
        </div>
      </div>

      {/* Evaluation 3 */}
      <div className='flex flex-col gap-4'>
        <p>Evaluation 3</p>
        <div className='w-full lg:w-[800px] flex flex-col gap-4 p-4 shadow-md'>
          <div>
            <h1 className='text-center text-lg font-medium'>Criteria 1</h1>
            <p className='text-center '>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut ullam
              ipsum.
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <button>Option 1</button>
            <button>Option 2</button>
            <button>Option 3</button>
          </div>
          <div className='flex justify-between'>
            <Button variant='primaryOutline'>Previous</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>

      {/* Evaluation 4 */}
      <div className='flex flex-col gap-4'>
        <p>Evaluation 4</p>
        <div className='w-full lg:w-[800px] flex flex-col gap-4 p-4 shadow-md'>
          <div>
            <h1 className='text-center text-lg font-medium'>Criteria 1</h1>
            <p className='text-center '>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut ullam
              ipsum.
            </p>
          </div>
          <div className='flex justify-center'>
            <button>
              <Icon icon='Star' />
            </button>
            <button>
              <Icon icon='Star' />
            </button>
            <button>
              <Icon icon='Star' />
            </button>
            <button>
              <Icon icon='Star' />
            </button>
            <button>
              <Icon icon='Star' />
            </button>
          </div>
          <div className='flex justify-between'>
            <Button variant='primaryOutline'>Previous</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>

      {/* Start */}
      <div className='flex flex-col gap-4'>
        <p>Start</p>
        <div className='w-full lg:w-fit flex shadow-md'>
          <div
            className={`${
              activePage === "first" ? "flex" : "hidden"
            } w-full lg:w-[300px] lg:flex flex-col gap-4 p-5`}
          >
            <button
              className='bg-primary-500 px-4 py-2 rounded-md'
              onClick={() => setActivePage("second")}
            >
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-white text-sm'>Full name</p>
                    <span className='bg-gray-500 text-white text-[8px] leading-4 font-medium px-2 py-0.5 rounded-full'>
                      Draft
                    </span>
                  </div>
                  <p className='text-white text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <Badge variant='gray'>Draft</Badge>
                  </div>
                  <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <Badge variant='green'>Done</Badge>
                  </div>
                  <p className='text-xs'>ProductHQ [PM Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-orange-500'></span>
                    </span>
                  </div>
                  <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-orange-500'></span>
                    </span>
                  </div>
                  <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
                    </span>
                  </div>
                  <p className='text-xs'>ProductHQ [PM Evaluation]</p>
                </div>
              </div>
            </button>
          </div>
          <div className='hidden lg:block border border-r-1 my-4'></div>
          <div
            className={`${
              activePage === "second" ? "flex" : "hidden"
            } w-full lg:w-[600px] lg:flex flex-col`}
          >
            <div className='p-5'>
              <button className='w-fit lg:hidden' onClick={() => setActivePage("first")}>
                <Icon icon='ChevronLeft' />
              </button>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center gap-4 p-5'>
              <div className='w-20 h-20 bg-black rounded-full'></div>
              <div className='flex flex-col text-center'>
                <p className='text-lg font-semibold'>Full name</p>
                <p className=''>ProductHQ [QA Evaluation]</p>
                <p>Evaluation Period</p>
              </div>
              <Button>Start evaluation</Button>
            </div>
          </div>
        </div>
      </div>

      {/* In progress */}
      <div className='flex flex-col gap-4'>
        <p>In progress</p>
        <div className='w-full lg:w-fit flex shadow-md'>
          <div
            className={`${
              activePage === "first" ? "flex" : "hidden"
            } w-full lg:w-[300px] lg:flex flex-col gap-4 p-5`}
          >
            <button
              className='bg-primary-500 px-4 py-2 rounded-md'
              onClick={() => setActivePage("second")}
            >
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-white text-sm'>Full name</p>
                    <Badge variant='gray'>Draft</Badge>
                  </div>
                  <p className='text-white text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <Badge variant='gray'>Draft</Badge>
                  </div>
                  <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <Badge variant='green'>Done</Badge>
                  </div>
                  <p className='text-xs'>ProductHQ [PM Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-orange-500'></span>
                    </span>
                  </div>
                  <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-orange-500'></span>
                    </span>
                  </div>
                  <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                </div>
              </div>
            </button>
            <button className='px-4 py-2 rounded-md'>
              <div className='flex gap-2 items-center'>
                <div className='w-10 h-10 bg-black rounded-full'></div>
                <div className='flex-1 flex flex-col text-start'>
                  <div className='flex justify-between'>
                    <p className='text-sm'>Full name</p>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
                    </span>
                  </div>
                  <p className='text-xs'>ProductHQ [PM Evaluation]</p>
                </div>
              </div>
            </button>
          </div>
          <div className='hidden lg:block border border-r-1 my-4'></div>
          <div
            className={`${
              activePage === "second" ? "flex" : "hidden"
            } w-full lg:w-[600px] lg:flex flex-col gap-4 p-5`}
          >
            <div className='lg:hidden'>
              <button className='w-fit' onClick={() => setActivePage("first")}>
                <div className='flex items-center gap-2'>
                  <Icon icon='ChevronLeft' />
                  <div className='text-start'>
                    <p className='text-lg font-bold'>Full name</p>
                    <p className='text-xs'>ProductHQ [QA Evaluation]</p>
                  </div>
                </div>
              </button>
            </div>
            <div className='flex justify-between'>
              <div className='w-1/2'>
                <h1 className='text-lg font-medium'>Criteria 1</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                  ullam ipsum.
                </p>
              </div>
              <div>
                <button className='text-orange-500'>
                  <Icon icon='Star' />
                </button>
                <button className='text-orange-500'>
                  <Icon icon='Star' />
                </button>
                <button className='text-orange-500'>
                  <Icon icon='Star' />
                </button>
                <button className='text-orange-500'>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='w-1/2'>
                <h1 className='text-lg font-medium'>Criteria 2</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                  ullam ipsum.
                </p>
              </div>
              <div>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='w-1/2'>
                <h1 className='text-lg font-medium'>Criteria 3</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque hic enim eos aut
                  ullam ipsum.
                </p>
              </div>
              <div>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
                <button>
                  <Icon icon='Star' />
                </button>
              </div>
            </div>
            <textarea
              className='p-4 border rounded-md'
              cols={30}
              rows={5}
              placeholder='Leave a comment'
            ></textarea>
            <div className='flex justify-end'>
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
