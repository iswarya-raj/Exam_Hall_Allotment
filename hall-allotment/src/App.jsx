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
    const [adminData, setAdminData] = useState([]);
    const [slotData,setSlotData]=useState([]);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [totalProfessors, setTotalProfessors] = useState(0);
    const [totalAssistantProfessors, setTotalAssistantProfessors] = useState(0);
    const [totalHallsAdmin, setTotalHallsAdmin] = useState(0);
    
    const adjustDuties = () => {
        event.preventDefault();
        if (totalProfessors > 0 && totalAssistantProfessors > 0 && total > 0) {
          const profDuties = Math.floor((total * 2) / (totalProfessors + totalAssistantProfessors * 2));
          const apDuties = Math.floor((total * 2 * 2) / (totalProfessors + totalAssistantProfessors * 2));
          setTotal(profDuties + apDuties);
          setRemaining(total - completed);
        }
      };

    const handleRadioChange = (event) => {
        setDesignation(event.target.value);
        adjustDuties();
    };

    const handleClick = async (event, newAction) => {
        event.preventDefault();
        if(action==="Login"){
            const staffID=document.getElementById("StaffID").value;
            if(staffID==="adminpsna123" && newAction==="Slot Registration"){
                setAction("Admin");
            }
            else if(newAction==="Staff Registration"){
                setAction("Staff Registration");
            }
            else{
                setAction("Slot Registration")
            }
        }else{
            setAction(newAction);
        }
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
            setSelected(prevSelected => [...prevSelected, slotData[index]]);
            setFrozenRows(prevFrozenRows => new Set(prevFrozenRows).add(index));
        }
    };

    const handleSave = (event) => {
        event.preventDefault();
        const totals = calculateTotalHalls();
        console.log("Aggregated slotData:", totals);
        setSlotData(totals); 
        const newHalls = totals.map(slot => slot.Halls);
        setHalls(newHalls);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
    };

    const calculateTotalHalls = () => {
        const totals = [];
        adminData.forEach(row => {
            const existingEntry = totals.find(item => item.Date === row.Date && item.Slot === row.Slot);
            if (existingEntry) {
                existingEntry.Halls += parseInt(row.Halls);
            } else {
                totals.push({ Date: row.Date, Slot: row.Slot, Time: row.Time, Halls: parseInt(row.Halls) });
            }
        });
        console.log("Calculated totals (slotData):", totals);
        return totals;
    };

    const addRow = (event) => {
        event.preventDefault();
        const newRow = { Date: "", Slot: "", Time: "", Dept: "", Halls: "" };
        setAdminData(prevData => [...prevData, newRow]);
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
                                    <div className="input-container">
                                    <i className="fas fa-user"></i>
                                    <input id="Name" className="InputIDs" type="text" placeholder="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name"/><br />
                                    </div>
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
                                    <div>Go back to Login: <span id="sma" onClick={(event) => handleClick(event, "Login")}>Login</span></div>
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
                                        <span id="sma" onClick={(event) => { handleClick(event, "Login"); }}>
                                            Login
                                        </span>
                                    </div>
                                </div>
                            }
                            {action==="Admin" &&
                            <div>
                              <h2>Admin Dashboard</h2>
                              <div className="input-container">
                                <label>Total Professors:</label>
                                <input
                                type="number"
                                value={totalProfessors}
                                onChange={(e) => setTotalProfessors(parseInt(e.target.value))}
                                />
                                </div>
                                <div className="input-container">
                                    <label>Total Assistant Professors:</label>
                                    <input
                                    type="number"
                                    value={totalAssistantProfessors}
                                    onChange={(e) => setTotalAssistantProfessors(parseInt(e.target.value))}
                                    />
                                    </div>
                                    <div className="input-container">
                                        <label>Total Halls:</label>
                                        <input
                                        type="number"
                                        value={totalHallsAdmin}
                                        onChange={(e) => setTotalHallsAdmin(parseInt(e.target.value))}
                                        />
                                        </div>
                                        <button onClick={adjustDuties}>Adjust Duties</button>
                                        <table id="myTable" className="table table-success table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Slot</th>
                                                    <th>Time</th>
                                                    <th>Department</th>
                                                    <th>No. of halls</th>
                                                </tr>
                                            </thead>
                                            <tbody>{
                                            adminData.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                    type="text"
                                                    value={row.Date}
                                                    onChange={(e) => {
                                                        const updatedRows = [...adminData];
                                                        updatedRows[index].Date = e.target.value;
                                                        setAdminData(updatedRows);
                                                    }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                    type="text"
                                                    value={row.Slot}
                                                    onChange={(e) => {
                                                        const updatedRows = [...adminData];
                                                        updatedRows[index].Slot = e.target.value;
                                                        setAdminData(updatedRows);
                                                    }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                    type="text"
                                                    value={row.Time}
                                                    onChange={(e) => {
                                                        const updatedRows = [...adminData];
                                                        updatedRows[index].Time = e.target.value;
                                                        setAdminData(updatedRows);
                                                    }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                    type="text"
                                                    value={row.Dept}
                                                    onChange={(e) => {
                                                        const updatedRows = [...adminData];
                                                        updatedRows[index].Dept = e.target.value;
                                                        setAdminData(updatedRows);
                                                    }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                    type="number"
                                                    value={row.Halls}
                                                    onChange={(e) => {
                                                        const updatedRows = [...adminData];
                                                        updatedRows[index].Halls = e.target.value;
                                                        setAdminData(updatedRows);
                                                    }}
                                                    />
                                                </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button onClick={(event) => handleClick(event, "Login")}>Back</button>
                                        <button id="moreBtn" onClick={addRow}>More</button>
                                        <button id="saveBtn" onClick={handleSave}>Save</button>
                                        <button id="view" onClick={(event) => handleClick(event, "Staff Duties")}>View</button>
                                        {showSavedMessage && (
                                            <div className="saved-message">
                                                --- Saved ---
                                            </div>
                                        )}  
                            </div>
                            }
                            {action==="Staff Duties" &&
                            <div>
                                <table className="table table-success table-striped">
                                    <thead>
                                        <tr>
                                            <th>Staff Name</th>
                                            <th>Staff ID</th>
                                            <th>Date</th>
                                            <th>Slot</th>
                                            <th>Department</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                                <button onClick={(event) => handleClick(event, "Admin")}>Back</button>
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
                                                {slotData.length===0?(
                                                        <tr>
                                                            <td colSpan="5">Not scheduled Yet.</td>
                                                        </tr>
                                                    ):(
                                                slotData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.Date}</td>
                                                        <td>{item.Slot}</td>
                                                        <td>{item.Time}</td>
                                                        <td>{halls[index]}</td>
                                                        <td>
                                                            {selected.includes(item) ? (
                                                                <span>Selected</span>
                                                            ) : (
                                                            <button onClick={() => Counter(index)} disabled={halls[index] === 0 || selected.includes(item)}>Select</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
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
                                    <button onClick={(event) => handleClick(event, "Slot Registration")}>Back</button>
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
