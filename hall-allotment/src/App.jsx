import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios'; // Import axios for API calls

const App = () => {
    const [action, setAction] = useState("Login");
    const [total, setTotal] = useState(12);
    const [completed, setCompleted] = useState(0);
    const [remaining, setRemaining] = useState(total);
    const [halls, setHalls] = useState(Array(12).fill(40));
    const [selected, setSelected] = useState([]);
    const [frozenRows, setFrozenRows] = useState(new Set());
    const [designation, setDesignation] = useState('');

    const data = [
        { Date: "05/11/2024", Slot: 'I', Time: "FN" },
        { Date: "05/11/2024", Slot: 'II', Time: "AN" },
        { Date: "06/11/2024", Slot: 'I', Time: "FN" },
        { Date: "06/11/2024", Slot: 'II', Time: "AN" },
        { Date: "07/11/2024", Slot: 'I', Time: "FN" },
        { Date: "07/11/2024", Slot: 'II', Time: "AN" },
        { Date: "08/11/2024", Slot: 'I', Time: "FN" },
        { Date: "08/11/2024", Slot: 'II', Time: "AN" },
        { Date: "09/11/2024", Slot: 'I', Time: "FN" },
        { Date: "09/11/2024", Slot: 'II', Time: "AN" },
        { Date: "10/11/2024", Slot: 'I', Time: "FN" },
        { Date: "10/11/2024", Slot: 'II', Time: "AN" },
    ];

    const TotalDuty = () => {
        if (document.getElementById('P').checked) {
            setTotal(10);
            setRemaining(10 - completed);
        } else {
            setTotal(12);
            setRemaining(12 - completed);
        }
    };

    const handleRadioChange = (event) => {
        setDesignation(event.target.value);
        TotalDuty();
    };

    const handleClick = async (event, newAction) => {
        event.preventDefault();

        if (newAction === "Done") {
            // Collect form data
            const name = document.getElementById('Name').value;
            const department = document.getElementById('Dept').value;
            const email = document.getElementById('mail').value;
            const phone_number = document.getElementById('mobile').value;
            const staff_code = document.getElementById('StaffID').value;
            const password = document.getElementById('Password').value;

            try {
                // Make API request to register the staff
                const response = await axios.post('http://localhost:5004/api/register', {
                    name,
                    department,
                    designation,
                    email,
                    phone_number,
                    staff_code,
                    password,
                });

                if (response.status === 201) {
                    alert('Registration successful');
                    setAction("Done"); // Show registration complete message
                } else {
                    alert('Registration failed');
                }
            } catch (error) {
                alert('There was an error during registration.');
                console.error('There was an error!', error);
            }
        } else if (newAction === "Slot Registration") {
            const staff_code = document.getElementById('StaffID').value;
            const password = document.getElementById('Password').value;

            try {
                const response = await axios.post('http://localhost:5004/api/login', {
                    staff_code,
                    password,
                });

                if (response.status === 200) {
                    alert('Login successful');
                    setAction("Slot Registration"); // Redirect to the Slot Registration page
                } else {
                    alert('Login failed. Please check your Staff ID and password.');
                }
            } catch (error) {
                alert('There was an error during login.');
                console.error('There was an error!', error);
            }
        } else if (newAction === "Login") {
            setAction("Login");
        } else {
            setAction(newAction);
        }
    };

    const Counter = (index) => {
        if (halls[index] - 1 > -1 && completed < total && !frozenRows.has(index)) {
            halls[index] -= 1;
            setHalls([...halls]);
            setCompleted(count => count + 1);
            setRemaining(count => count - 1);
            setSelected(prevSelected => [...prevSelected, data[index]]);
            setFrozenRows(prevFrozenRows => new Set(prevFrozenRows).add(index));
        }
    };

    return (
        <div className="bg-img">
            <div className="overlay">
                <div className='outer-box'>
                    <h1>{action}</h1>
                    <div className='box'>
                        <form>
                            {action === "Staff Registration" &&
                                <div>
                                    <label>Name</label>
                                    <input id="Name" className="InputIDs" type="text" /><br />
                                    <label>Department</label>
                                    <input id="Dept" className="InputIDs" type="text" /><br />
                                    <label>Designation</label><br />
                                    <input id="AP" className="InputIDs" type="radio" value="AP" name="desg" onChange={handleRadioChange} />Assistant Professor<br />
                                    <input id="P" className="InputIDs" type="radio" value="P" name="desg" onChange={handleRadioChange} />Professor<br />
                                    <label>Email</label>
                                    <input id="mail" className="InputIDs" type="email" /><br />
                                    <label>Mobile</label>
                                    <input id="mobile" className="InputIDs" type="text" /><br />
                                    <label>Staff ID</label>
                                    <input id="StaffID" className="InputIDs" type="text" /><br />
                                    <label>Password</label>
                                    <input id="Password" className="InputIDs" type="password" /><br />
                                    <button id="Register" onClick={(event) => handleClick(event, "Done")}>Register</button><br />
                                    <div>Go back to Login: <button id="sma" onClick={(event) => handleClick(event, "Login")}>Login</button></div>
                                </div>
                            }
                            {action === "Login" &&
                                <div>
                                    <label>Staff ID</label>
                                    <input id="StaffID" className="InputIDs" type="text" /><br />
                                    <label>Password</label>
                                    <input id="Password" className="InputIDs" type="password" /><br />
                                    <button id="Login" onClick={(event) => handleClick(event, "Slot Registration")}>Login</button><br />
                                    <div>Not Registered yet? <span onClick={(event) => handleClick(event, "Staff Registration")}>Register</span></div>
                                </div>
                            }
                            {action === "Done" &&
                                <div>
                                    <div id="done">Registration Complete!</div>
                                    <div>Go back to Login:
                                        <button id="sma" onClick={(event) => { handleClick(event, "Login"); }}>
                                            Login
                                        </button>
                                    </div>
                                </div>
                            }

                            {action === "Slot Registration" &&
                                <div>
                                    <ul>
                                        <li>Your duties Total: {total} </li>
                                        <li>Completed: {completed} </li>
                                        <li>Remaining: {remaining}</li>
                                    </ul>
                                    <div>
                                        <table className="table table-success table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Slot</th>
                                                    <th>Time</th>
                                                    <th>No. of halls available</th>
                                                    <th>Selection</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.Date}</td>
                                                        <td>{item.Slot}</td>
                                                        <td>{item.Time}</td>
                                                        <td>{halls[index]}</td>
                                                        <td><button className="Select" onClick={(event) => { event.preventDefault(); Counter(index); }}>Select</button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button onClick={(event) => handleClick(event, "Hall Allotment")}>View</button>
                                    </div>
                                </div>
                            }
                            {action === "Hall Allotment" &&
                                <div>
                                    <table className="table table-success table-striped">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Slot</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selected.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.Date}</td>
                                                    <td>{row.Slot}</td>
                                                    <td>{row.Time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
