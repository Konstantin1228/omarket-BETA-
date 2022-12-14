import React, { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import ReactCountryFlag from "react-country-flag";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAppDispatch } from "../../../hooks/hooks";
import { setUserInformation, setNextStage, setIsUserAuth } from "../../../redux/user/slice";
import { formattedTelephone } from "../FunctionsAndTypes/functions";
import { LoginInterface } from "../FunctionsAndTypes/types";
import { useNavigate } from "react-router-dom";
import { addStatusToasts } from "../../../redux/toasts/slice";
const LoginIndex: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [visibilityEye, setVisibilityEye] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [country, setCountry] = useState("");
    const { register, formState: { errors, isValid }, control, trigger, setError, handleSubmit, setValue, clearErrors } = useForm<LoginInterface>({ mode: "onChange" })

    const onSubmit: SubmitHandler<LoginInterface> = async (data) => {
        const { tel, country, password } = data
        setLoading(true)
        const q = await getDocs(query(collection(db, "users"), where("country", '==', country), where("telephone", '==', tel)))
        if (q.size !== 0) {
            const userRef = doc(db, 'users', q.docs[0].id);
            const docSnap = await getDoc(userRef);
            const userPassword = docSnap.data()?.password
            if (userPassword === password) {
                localStorage.setItem("telephone", data.tel)
                //@ts-ignore
                dispatch(setUserInformation(q.docs[0]["_document"].data.value.mapValue.fields))
                dispatch(setIsUserAuth(true))
                navigate("/home")
                dispatch(addStatusToasts({ message: "???? ?????????????? ?????????? ?? ??????????????!", isComplete: true }))
            }
            else setError("password", { type: 'custom', message: '???????????????????????? ????????????!' })
        } else {
            setError("tel", { type: 'custom', message: '???????????????????????? ??????????????/????????????!' })
        }
        setLoading(false)
    }

    const options = [
        { value: 'rus', label: <div className="select-option"> <ReactCountryFlag countryCode="RU" svg /> ????????????</div> },
        { value: 'kaz', label: <div className="select-option"> <ReactCountryFlag countryCode="KZ" svg /> ??????????????????</div> },
        { value: 'uzb', label: <div className="select-option"> <ReactCountryFlag countryCode="UZ" svg /> ????????????????????</div> },
        { value: 'bel', label: <div className="select-option"> <ReactCountryFlag countryCode="BY" svg /> ????????????????</div> },
    ]

    return (
        <div className="auth">
            {loading ?
                <div className="container__loader-absolute">
                    <div className="lds-ring" ><div></div><div></div><div></div><div></div></div>
                </div>
                :
                <>
                    <div className="auth__title">
                        <h1 className="auth__title-text">?????????????????????? </h1>
                    </div>
                    <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            name="country"
                            render={({ fieldState: { error } }) => (
                                <div className="auth__form-parent">
                                    <Select value={country ? options.find((el) => el.value === country) : ""} classNamePrefix="reactSelect" maxMenuHeight={150}
                                        onChange={(newValue: any) => {
                                            setValue("country", newValue.value)
                                            trigger("country")
                                            setCountry(newValue.value)
                                        }} isSearchable={false} options={options} placeholder="????????????" components={makeAnimated()} />
                                    {error && <p className="errorAuth" >{error.message || "????????????!"} </p>}
                                </div>
                            )}
                            rules={{ required: "???????????????? ???????? ????????????!" }}
                        />
                        <div className="auth__form-parent" >
                            <input type="tel" {...register("tel", {
                                required: "???????? ?????????????????????? ?? ????????????????????!",
                                pattern: {
                                    message: "?????????????? ???????????????????? ?????????? ????????????????!",
                                    value: /^[+]{1}[0-9]{1} [(]{1}[0-9]{3}[)]{1} [0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/
                                },
                                onChange: (e) => setValue("tel", formattedTelephone(e, setError, clearErrors))
                            })} className={`${errors.tel ? "input-error" : "input"}`} placeholder="?????????? ????????????????" />
                            {errors.tel && <p className="errorAuth">{errors?.tel?.message || "????????????!"}</p>}
                        </div>
                        <div className="auth__form-parentPassword" onMouseEnter={() => setVisibilityEye(true)} onMouseLeave={() => setVisibilityEye(false)} >
                            <input {...register("password", {
                                required: "???????? ?????????????????????? ?? ????????????????????!",
                                minLength: {
                                    value: 8,
                                    message: "?????????????? ???????????????????? ????????????!"
                                }
                            })}
                                className={`${errors.password ? passwordShown ? "input-error" : "input-passwordError" : passwordShown ? "input" : "input-password"}`}
                                type={passwordShown ? "text" : "password"} placeholder="????????????" />
                            {errors.password && <p className="errorAuth">{errors?.password?.message || "????????????!"}</p>}
                            {visibilityEye &&
                                <span className="eye" onClick={() => setPasswordShown(!passwordShown)}>
                                    {passwordShown ? <i className="fa fa-eye" /> : <i className="fa fa-eye-slash" />}
                                </span>
                            }
                        </div>
                        <button type="submit" className={`button-submit${isValid ? "" : "-false"}`}>??????????</button>
                        <div className="auth__form-help bold" onClick={() => dispatch(setNextStage({ stage: 1, type: "recoveryPass" }))}>???????????? ?????????????</div>
                        <div className="auth__form-help bold" onClick={() => dispatch(setNextStage({ stage: 1, type: "registration" }))} style={{ marginTop: -13 }}>?? ?????? ?????? ?????????????????</div>
                    </form >
                </>
            }
        </div >
    )
}

export default LoginIndex
