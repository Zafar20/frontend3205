import MaskedInput from 'react-text-mask';
import axios from 'axios';
import { Event, IUser, useAllLogic} from '../hooks/useAllLogic'



function App() {


  const {  
    resetFn, 
    preventFn, 
    errorFn,
    setUsers,
    setEmail,
    setNumber,
    setIsLoading,
    setCancelTokenSource,
    users, 
    email,
    number, 
    isLoading, 
    emailError, 
    responseError, 
    cancelTokenSource 
  } = useAllLogic()
  

  const getUser = async (e:Event) => {
    preventFn(e)
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled due to new request.');
    }
    const newCancelTokenSource = axios.CancelToken.source();
    setCancelTokenSource(newCancelTokenSource);
    if(email) {
      try {
        resetFn()
        const { data } = await axios.get<IUser[]>(`http://localhost:3000/users`, {
          params: { email, number },
          cancelToken: newCancelTokenSource.token, 
        }) 
        setUsers(data)
      } catch (error) {
        errorFn(error)
      }finally{
        setIsLoading(false)
      }
    }
   
  }
  
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <form className="form" onSubmit={getUser}>
            <div className="form__item">
              <label htmlFor="" className="form__item-label">Введите email</label>
              <input 
                type="email" 
                className="form__item-input"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               {emailError && <span className="form__item-message">{emailError}</span>}
            </div>
            <div className="form__item">
              <label htmlFor="" className="form__item-label">Введите номер</label>
              <MaskedInput
                mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                placeholder="12-34-56"
                className="form__item-input"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <button disabled={isLoading} className="form__btn">
              {isLoading ? 'Идет загрузка...' : 'Поиск'}
            </button>
          </form>
          {users && (
            <ul className="user">
              {users.map((user, index) => (
                <li className="user__item" key={index}>
                  Email - {user.email}, number - {user.number}
                </li>
              ))}
            </ul>
          )}
          <h2 className="form__error">{responseError}</h2>
        </div>
      </div>
    </>
  )
}

export default App
