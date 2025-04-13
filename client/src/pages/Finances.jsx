import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    addDoc,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Finances() {
    const [user, setUser] = useState(null);
    const [incomeEntries, setIncomeEntries] = useState([]);
    const [expenseEntries, setExpenseEntries] = useState([]);
    const [newIncome, setNewIncome] = useState('');
    const [newExpense, setNewExpense] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const incomeRef = collection(db, 'users', user.uid, 'income');
        const expenseRef = collection(db, 'users', user.uid, 'expenses');

        const unsubIncome = onSnapshot(incomeRef, (snapshot) => {
            setIncomeEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        const unsubExpense = onSnapshot(expenseRef, (snapshot) => {
            setExpenseEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubIncome();
            unsubExpense();
        };
    }, [user]);

    const addIncome = async () => {
        if (!user || !newIncome) return;
        await addDoc(collection(db, 'users', user.uid, 'income'), {
            amount: parseFloat(newIncome),
            createdAt: Date.now(),
        });
        setNewIncome('');
    };

    const addExpense = async () => {
        if (!user || !newExpense) return;
        await addDoc(collection(db, 'users', user.uid, 'expenses'), {
            amount: parseFloat(newExpense),
            createdAt: Date.now(),
        });
        setNewExpense('');
    };

    const totalIncome = incomeEntries.reduce((acc, entry) => acc + entry.amount, 0);
    const totalExpenses = expenseEntries.reduce((acc, entry) => acc + entry.amount, 0);
    const net = totalIncome - totalExpenses;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>🪙 Finances</h1>
            <h2>Net Balance: ${net.toFixed(2)}</h2>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                    <h3>Income</h3>
                    <input
                        type="number"
                        placeholder="Add income"
                        value={newIncome}
                        onChange={(e) => setNewIncome(e.target.value)}
                    />
                    <button onClick={addIncome}>Add</button>
                    <ul>
                        {incomeEntries.map((entry) => (
                            <li key={entry.id}>+ ${entry.amount}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Expenses</h3>
                    <input
                        type="number"
                        placeholder="Add expense"
                        value={newExpense}
                        onChange={(e) => setNewExpense(e.target.value)}
                    />
                    <button onClick={addExpense}>Add</button>
                    <ul>
                        {expenseEntries.map((entry) => (
                            <li key={entry.id}>- ${entry.amount}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Finances;
