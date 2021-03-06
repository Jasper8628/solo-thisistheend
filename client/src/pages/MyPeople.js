import React, { useRef, useState, useEffect } from "react";
import { useHistory } from 'react-router';
import Subheader from "../components/Subheader/Subheader";
import { useUserContext } from "../utils/userLoginContext";
import "./MyPeople.css";
import axios from "axios";

function MyPeople() {

    // declare variable for later page redirects
    const history = useHistory();

    // declare useRef
    var formRef = useRef();
    var roleRef = useRef();
    var nameRef = useRef();
    var contactRef = useRef();
    var emailRef = useRef();
    var responsibilityRef = useRef();
    var listRef = useRef();

    // declare useContext
    const [state, dispatch] = useUserContext();

    // declare useState
    const [role, setRole] = useState();
    const [name, setName] = useState();
    const [contact, setContact] = useState();
    const [email, setEmail] = useState();
    const [responsibility, setresponsibility] = useState();
    const [list, setList] = useState([]);

    //to set initial state after page load to display nominee list
    useEffect(() => {

        const getToken = localStorage.getItem('token');
        const getUserid = localStorage.getItem('userId');

        // get list of nominees in the database based on userID
        getList();

        // get user details using logged in userID and jwt for authentication
        axios.get("/api/users/account/" + getUserid, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${getToken}`
            }
        }).then((res, err) => { // then print response status
            if (err) throw (err)

            if (res.data.success) {
                console.log("get userlogin status is successful")
                dispatch({ type: "logged in", username: res.data.user.username })
            }
        })

    }, []);

    //change all input to uppercase
    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    //submit nominee entry
    const onClickHandler = (e) => {
        e.preventDefault();
        const getUserid = localStorage.getItem('userId');
        const formData = new FormData();

        formData.append("role", role);
        formData.append("name", name);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("responsibility", responsibility);
        formData.append("userID", getUserid);


        const token = localStorage.getItem('token');

        axios.post("/api/nominees/submit", formData, {

            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data'; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${token}`
            }
        }).then((res, err) => { // then print response status
            if (err) throw (err)

            if (res.data.success) {
                console.log("nominee entry is successful")

                getList();
                resetFields();
                history.push("/mypeople");
            }
        })
    }

    // get list of nominees in database for display
    function getList() {

        const getToken = localStorage.getItem('token');
        const getUserid = localStorage.getItem('userId');

        axios.get("/api/nominees/list/" + getUserid, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${getToken}`
            }
        })
            .then(function (response) {
                const listArray = response.data;
                setList(listArray)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //reset form after each submission
    function resetFields() {
        formRef.reset();
    }

    // FOR LATER CREATION OF NOMINEE UPDATE FUNCTION
    // /  `api/nominess/update/{_id}`


    // create Nominee delete function
    function deleteNominee(_id) {
        const getToken = localStorage.getItem('token');
        axios.delete("/api/nominees/delete/" + _id, {
            // { params: { id: _id }}
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${getToken}`
            }
        })
            .then(function (response) {
                getList();
                resetFields();
                history.push("/mypeople");
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    return (
        <div>
            <Subheader h4="My People" p="Nominate your trusted people to take care of administrative matters" />
            <div className="wrapperuploaded">
                <h5 id="nomineeListHeader">Your Nomination List</h5>
                <div className="container w">
                    <ul className="list-group">
                        {list.map(({ role, name, contact, responsibility, email, _id }) => (
                            <li key={_id} ref={ref => listRef = ref} className="list-group-item listDesign">
                                <p className="nomineeItem">My {role} is {name}. Their responsibility is {responsibility}.
                                </p>
                                <button onClick={() => deleteNominee(_id)} className="deletebtn"><i className="fa fa-trash" aria-hidden="true"></i></button>
                            </li>
                        ))}
                    </ul>
                    <br />
                    <br />
                </div>
            </div>
            <div className="wrapperupload">
                <div className="containerupload">
                    <h5 id="nomineeHeader">Enter A Nominee</h5>
                    <small id="emailHelp" className="form-text text-muted">We'll never share private information with anyone else.</small>
                    <br />
                    <form
                        onSubmit={onClickHandler}
                        id='nomineesForm'
                        action='/api/nominees/submit'
                        method='post'
                        encType="multipart/form-data"
                        ref={ref => formRef = ref}>
                        <div className="form-group">
                            <label className="formLabel">Role:</label>
                            <input ref={ref => roleRef = ref} onChange={(e) => setRole(e.target.value)} onInput={toInputUppercase} type="text" className="form-control" id="role" aria-describedby="emailHelp" placeholder="Enter role" />
                        </div>
                        <div className="form-group">
                            <label className="formLabel">Full Name:</label>
                            <input ref={ref => nameRef = ref} onChange={(e) => setName(e.target.value)} onInput={toInputUppercase} type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter full name" />
                        </div>
                        <div className="form-group">
                            <label className="formLabel">Contact Number:</label>
                            <input ref={ref => contactRef = ref} onChange={(e) => setContact(e.target.value)} onInput={toInputUppercase} type="number" className="form-control" id="contactnum" placeholder="Enter contact number" />
                        </div>
                        <div className="form-group">
                            <label className="formLabel">Email:</label>
                            <input ref={ref => emailRef = ref} onChange={(e) => setEmail(e.target.value)} onInput={toInputUppercase} type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />

                        </div>
                        <div className="form-group">
                            <label className="formLabel">Responsibilities:</label>
                            <input ref={ref => responsibilityRef = ref} onChange={(e) => setresponsibility(e.target.value)} onInput={toInputUppercase} type="text" className="form-control" id="responsibility" placeholder="Enter comments to further define role such as 'to be in charge of insurance claims'" />
                        </div>
                        <button type="submit" className="btn btn-outline-primary" id="nomineeBtn">Submit</button>
                    </form>
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        </div>
    )
}

export default MyPeople;