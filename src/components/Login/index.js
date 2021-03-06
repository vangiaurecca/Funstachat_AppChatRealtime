import React from 'react';
import '../../App.css'
import styled from 'styled-components';
import { AiOutlineMail } from "react-icons/ai"
import { UserOutlined, UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Input, Button } from 'antd';
import ButtonLoginSocial from './ButtonLoginSocial'
import { auth } from '../../firebase/config';
import { AuthContext } from '../../context/AuthProvider';
import { addDocument, generateKeywords } from '../../firebase/services';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ToastError, ToastWarning, ToastSuccess} from './ToastNotity';

const SectionStyled = styled.section`
    width: 100%;
    min-height: 100vh;
    background: url("https://i.stack.imgur.com/pRumE.png") no-repeat top center;
    background-size: cover;
    position: relative;
`
const LoginContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    max-width: 800px;
    background: rgba(27, 13, 104, 0.18);
    min-height: 100vh;
    padding: 0 0 0 100px;
`

const TitleStyled = styled.h2`
margin: 0 0 14px 0;
font-family: 'Lobster', cursive;
font-size: 50px;
line-height: 1;
letter-spacing: 1px;
color: #FFFF00;
font-weight: 600;
`
const RowStyled = styled.div`
    width: 100%;
    max-width: 400px;
    margin: 0 0 10px 0;
    display: block;
    align-items: center;
    justify-content: space-between;

    .divine{
        padding: 40px 40px 20px;
        display: flex;
      }
      .divine div:nth-child(2) {
          font-size: 18px;
          font-weight: 800;
          line-height: 15px;
          margin: 0 18px;
          color: #FFFF00;
      }
      
      .divine div:nth-child(1),
      .divine div:nth-child(3) {
          flex-grow: 1;
          height: 3px;
          background-color: #FFFF00;
          position: relative;
          top: 0.45em;
      }
`

const InputStyled = styled(Input)`
    color: #fff;
    padding: 20px;
    font-size: 20px;
    .ant-input{
        color: #fff;
    }
    .ant-input-prefix{
        font-size: 30px;
    }
`

const ButtonStyled = styled.button`
    padding: 12px 40px;
    border-radius: 30px;
    border: none;
    outline: none;
    width: 100%;
    align-items: center;
    margin: 10px 0 0 0;
    background-image: linear-gradient(to right, #009245, #FCEE21, #00A8C5, #D9E021);
    box-shadow: 0 4px 8px 0 rgba(83, 176, 57, 0.75);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    transition: background 700ms;
    cursor: pointer;
    display: flex;
    justify-content: center;
    :hover{
        transition: all .6s ease-in-out;
        background: linear-gradient(to right, #f5ce62, #e43603, #fa7199, #e85a19);
        box-shadow: rgba(240, 46, 170, 0.4) 0px 5px, rgba(240, 46, 170, 0.3) 0px 10px, rgba(240, 46, 170, 0.2) 0px 15px, rgba(240, 46, 170, 0.1) 0px 20px, rgba(240, 46, 170, 0.05) 0px 25px;
    }
`
const RegisterForm = styled.div`
    padding-top: 24px;
    margin-bottom: 10px;
    .ant-btn{
        margin-left: 10px;
        color: #ffff00;
        font-size: 18px;
        font-weight: 600;
    }
    .ant-btn:hover{
        color: #99CCFF;
    }
`

var uidRegister = null
function Login() {

    var success = null
    const {user:{uid}} = React.useContext(AuthContext)
    const [isRegister, setIsRegister] = React.useState(false)
    const [fullname, setFullname] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')

    const handleToggleRegister = () => {
        setIsRegister(!isRegister)
    }
    
    React.useEffect(()=>{
        uidRegister = uid
    }, [uid])

    const handleLoginWithAccount = async () => {
        const edtFullname = fullname.trim().length
        const edtPassword = password.trim().length
        const edtEmail    = email.trim().length
        const edtConfirmPassword = confirmPassword.trim().length

        if(isRegister)
        {
            if(edtFullname > 0 && edtEmail > 0 && edtPassword > 0 && edtConfirmPassword > 0)
            {
                if(edtPassword === edtConfirmPassword)
                {
                    await auth.createUserWithEmailAndPassword(email, password)
                    .catch((err)=>{
                        switch(err.code)
                        {
                            case "auth/email-already-in-use":
                                ToastWarning('T??i kho???n ???? t???n t???i')
                                return
                            case "auth/invalid-email":
                                success = -1
                                ToastError('Sai ?????nh d???ng ?????a ch??? Email')   
                                return
                            case "auth/weak-password":
                                success = -1
                                ToastError('M???t kh???u ph???i c?? ??t nh???t 6 k?? t???')
                                return
                            default:
                                ToastWarning('L???i server')
                        }
                    })
                    .then(
                        success !== -1 ? success = 1 : success = 0
                    )
                    if(success === 1)
                    {
                        addDocument('users', 
                        {
                            displayName: fullname,
                            email: email,
                            photoURL: null,
                            uid: uidRegister,
                            providerId: "gmail.com",
                            keywords: generateKeywords(fullname?.toLowerCase()),
                        });
                        ToastSuccess('????ng k?? th??nh c??ng')
                    }
                }
                else
                {
                    ToastError('M???t kh???u kh??ng tr??ng kh???p')
                }
            }
            else
            {
                ToastWarning('Vui l??ng nh???p ?????y ????? th??ng tin')
            }

        }
        else
        {
            if(edtEmail > 0 && edtPassword > 0){
                auth.signInWithEmailAndPassword(email, password)
                .catch((err)=>{
                    switch(err.code)
                    {
                        case "auth/user-disabled":
                            ToastWarning('T??i kho???n ???? b??? v?? hi???u h??a')
                            break
                        case "auth/invalid-email":
                            ToastError('Email kh??ng h???p l???')
                            break
                        case "auth/user-not-found":
                            ToastError('T??i kho???n kh??ng t???n t???i')
                            break
                        case "auth/wrong-password":
                            ToastError('M???t kh???u kh??ng ch??nh x??c')
                            break
                        default: 
                            ToastWarning('L???i server')
                    }
                })
            }
            else
            {
                ToastError('Vui l??ng nh???p ?????y ????? th??ng tin')
            }
            
        }
        
    }

    return (
        <SectionStyled>
            <LoginContainer>
                <TitleStyled>Login Instachat</TitleStyled>
                <RowStyled>  
                    {!isRegister ? 
                    (<>
                    <InputStyled
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        size="large"
                        bordered={false}
                        placeholder="Nh???p t??i kho???n"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="T??i kho???n l?? ?????a ch??? email">
                                <InfoCircleOutlined style={{ color: '#fff' }} />
                            </Tooltip>
                        }
                    />
                    <InputStyled
                        onPressEnter={handleLoginWithAccount}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        size="large"
                        bordered={false}
                        placeholder="Nh???p m???t kh???u"
                        prefix={<UnlockOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="M???t kh???u ??t nh???t 6 k?? t???">
                                <InfoCircleOutlined style={{ color: '#fff' }} />
                            </Tooltip>
                        }
                    />
                    </>) : 
                    (<>
                    <InputStyled
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        size="large"
                        bordered={false}
                        placeholder="Nh???p h??? v?? t??n"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="H??? v?? t??n s??? hi???n th??? khi chat">
                                <InfoCircleOutlined style={{ color: '#fff' }} />
                            </Tooltip>
                        }
                    />
                    <InputStyled
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        size="large"
                        bordered={false}
                        placeholder="Nh???p ?????a ch??? email"
                        prefix={<AiOutlineMail className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="T??i kho???n l?? ?????a ch??? email">
                                <InfoCircleOutlined style={{ color: '#fff' }} />
                            </Tooltip>
                        }
                    />
                    <InputStyled
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        size="large"
                        bordered={false}
                        placeholder="Nh???p m???t kh???u"
                        prefix={<UnlockOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="M???t kh???u ??t nh???t 6 k?? t???">
                                <InfoCircleOutlined style={{ color: '#fff' }} />
                            </Tooltip>
                        }
                    />
                    <InputStyled
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        type="password"
                        size="large"
                        bordered={false}
                        placeholder="Nh???p l???i m???t kh???u"
                        prefix={<UnlockOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="M???t kh???u ??t nh???t 6 k?? t???">
                                <InfoCircleOutlined style={{ color: '#fff' }} />
                            </Tooltip>
                        }
                    />
                    </>)}
                <ButtonStyled
                    onClick={handleLoginWithAccount}
                >
                    {!isRegister ? '????NG NH???P' : '????NG K??'}
                </ButtonStyled>
                <div className="divine">
                    <div></div>
                    <div>OR</div>
                    <div></div>               
                </div>
                <ButtonLoginSocial/>
                <RegisterForm style={{padding: '30px'}}>
                    <span style={{color: '#fff', fontSize:'16px'}}>
                        {!isRegister ? 'B???n ch??a c?? t??i kho???n?' : 'B???n ???? c?? t??i kho???n?'}
                    </span>
                    <Button 
                        style={{marginLeft: '10px'}} 
                        type="link"
                        onClick={handleToggleRegister}
                    >{!isRegister ? 'T???o t??i kho???n' : '????ng nh???p'}</Button>
                </RegisterForm>
                </RowStyled>
            </LoginContainer>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </SectionStyled>
    )
}

export default Login