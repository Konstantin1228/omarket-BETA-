import React from 'react'
import { FormControlLabel } from '@mui/material'
import Checkbox from '@mui/material/Checkbox/Checkbox'
import { NavLink, useLocation } from 'react-router-dom'
import { CartIcon, ProfileIcon } from '../../../Other/Header/HeaderIcons'
import { LocationIcon } from '../../../Other/Footer/Icons'
import { SearchAdressOrCard } from '../../FunctionsAndTypes/types'
import { CardIcon } from '../../Icons/CardIcon'
import { DocumentIcon } from '../../Icons/DocumentIcon'

const SelectBar: React.FC<SearchAdressOrCard> = ({ filterOrders, setFilterOrders }) => {
    const location = useLocation().pathname
    return (
        <div className="profile__left">
            <ul className="profile__left-ul">
                <NavLink to="/profile" className={() => `profile__left-ul-${location === "/profile" ? `liActive` : `li`}`} >
                    <div className="profile__left-ul-li-svg"><ProfileIcon /></div>
                    <span className="profile__left-ul-li-text">Профиль</span>
                </NavLink>
                <NavLink to="myOrders" className={({ isActive }) => `profile__left-ul-${isActive ? `liActive` : `li`}`}>
                    <div className="profile__left-ul-li-svg"><CartIcon /></div>
                    <span className="profile__left-ul-li-text">Мои заказы</span>
                </NavLink>
                <NavLink to="myPatterns" className={({ isActive }) => `profile__left-ul-${isActive ? `liActive` : `li`}`}>
                    <div className="profile__left-ul-li-svg"><DocumentIcon /></div>
                    <span className="profile__left-ul-li-text">Мои шаблоны</span>
                </NavLink>
                <NavLink to="myAdress" className={({ isActive }) => `profile__left-ul-${isActive ? `liActive` : `li`}`}>
                    <div className="profile__left-ul-li-svg"><LocationIcon /></div>
                    <span className="profile__left-ul-li-text">Мои адреса</span>
                </NavLink>
                <NavLink to="myBankCards" className={({ isActive }) => `profile__left-ul-${isActive ? `liActive` : `li`}`}>
                    <div className="profile__left-ul-li-svg"><CardIcon /></div>
                    <span className="profile__left-ul-li-text">Моя карта</span>
                </NavLink>
            </ul>
            {location === "/profile/myOrders" &&
                (filterOrders.adresses[0].adress || filterOrders.payment[0].paymentType) &&
                <ul className="profile__left-ul">
                    <span className="profile__left-ul-li-title bold" style={{ margin: "1rem 0" }}>Адрес</span>
                    <ul className="profile__left-ul-checkboxes">
                        {filterOrders.adresses.map((userAdress) =>
                            <FormControlLabel
                                key={userAdress.adress}
                                control={
                                    <Checkbox
                                        checked={userAdress.isActive}
                                        onChange={() => setFilterOrders(({ adresses, payment }) => ({
                                            adresses: adresses.map(({ adress, isActive }) => { return { adress, isActive: adress === userAdress.adress ? !isActive : isActive } }), payment
                                        }))}
                                    />
                                }
                                label={userAdress.adress} />
                        )}
                    </ul>
                    <span className="profile__left-ul-li-title bold">Способ оплаты</span>
                    <ul className="profile__left-ul-checkboxes">
                        {filterOrders.payment.map((typeOfPayment, idx) =>
                            <FormControlLabel
                                key={typeOfPayment.paymentType}
                                control={
                                    <Checkbox
                                        checked={typeOfPayment.isActive}
                                        onChange={() => setFilterOrders(({ adresses, payment }) => ({
                                            adresses: adresses, payment: payment.map(({ paymentType, isActive }) => { return { paymentType, isActive: paymentType === typeOfPayment.paymentType ? !isActive : isActive } })
                                        }))}
                                    />
                                }
                                label={typeOfPayment.paymentType} />
                        )}
                    </ul>
                </ul>
            }
        </div >
    )
}

export default SelectBar 