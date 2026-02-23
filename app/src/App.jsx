import { useState, useEffect } from "react";
import "./App.css";

import { join, getWinner, getMembers, getBalance } from './blockchainUtils';

function App() {
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);

  const Join = async () => {
    await join();       
    const updated = await getMembers();   
    if (updated) 
      setMembers(updated);
    if (message != '')
      setMessage('');
  };

  const Winner = async () => {
    const winner = await getWinner();       
    const updated = await getMembers();   
    if (updated) setMembers(updated);    

    if (winner) {
      setMessage(`Winner is ${winner}`);
    }
  };

  const Balance = async () => {
    const getbalance = await getBalance();       
    if (getbalance) 
      setBalance(getbalance);  
      setMessage(`Balance is ${getbalance}`);  
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const members = await getMembers();
      if (members) setMembers(members);
    };

    fetchMembers(); 
  }, []);

  return (
  <div className="layout">
    <div className="memberList">
      {members.map(member => (
        <p className="member" key={member}>{member}</p>
      ))}
    </div>

    <div className="container">
      <h1>Lottery Game</h1>
      <p>Do you want to join the lottery? Click the button below.</p>

      <div className="buttons">
        <button className="join" onClick={Join}>
          Join to lottery
        </button>

        <button className="view" onClick={Balance}>
          View Balance
        </button>

        <button className="view" onClick={Winner}>
          View winner
        </button>
      </div>

      <div className="winner">
        {message && <div className="result">{message}</div>}
      </div>
    </div>
  </div>
  );
}

export default App;
