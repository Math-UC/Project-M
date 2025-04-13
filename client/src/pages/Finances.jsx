import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
    getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Finances() {
    const [user, setUser] = useState(null);
    const [incomeEntries, setIncomeEntries] = useState([]);
    const [expenseEntries, setExpenseEntries] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState(['Salary', 'Freelance', 'Bonus', 'Investment', 'Other']);
    const [expenseCategories, setExpenseCategories] = useState(['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Subscriptions', 'Other']);
    const [newIncome, setNewIncome] = useState('');
    const [incomeCategory, setIncomeCategory] = useState('');
    const [incomeDescription, setIncomeDescription] = useState('');
    const [newExpense, setNewExpense] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [editingEntry, setEditingEntry] = useState(null);
    const [editingType, setEditingType] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userCatDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userCatDoc.exists()) {
                    const data = userCatDoc.data();
                    if (data.incomeCategories) setIncomeCategories(data.incomeCategories);
                    if (data.expenseCategories) setExpenseCategories(data.expenseCategories);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const updateUserCategories = async (newCat, type) => {
        const ref = doc(db, 'users', user.uid);
        if (type === 'income') {
            const updated = [...new Set([...incomeCategories, newCat])];
            setIncomeCategories(updated);
            await setDoc(ref, { incomeCategories: updated }, { merge: true });
        } else {
            const updated = [...new Set([...expenseCategories, newCat])];
            setExpenseCategories(updated);
            await setDoc(ref, { expenseCategories: updated }, { merge: true });
        }
    };

    const addIncome = async () => {
        if (!user || !newIncome || !incomeCategory) return;
        await addDoc(collection(db, 'users', user.uid, 'income'), {
            amount: parseFloat(newIncome),
            category: incomeCategory,
            description: incomeDescription,
            createdAt: serverTimestamp(),
        });
        await updateUserCategories(incomeCategory, 'income');
        setNewIncome('');
        setIncomeCategory('');
        setIncomeDescription('');
    };

    const addExpense = async () => {
        if (!user || !newExpense || !expenseCategory) return;
        await addDoc(collection(db, 'users', user.uid, 'expenses'), {
            amount: parseFloat(newExpense),
            category: expenseCategory,
            description: expenseDescription,
            createdAt: serverTimestamp(),
        });
        await updateUserCategories(expenseCategory, 'expense');
        setNewExpense('');
        setExpenseCategory('');
        setExpenseDescription('');
    };

    const startEditing = (type, entry) => {
        setEditingType(type);
        setEditingEntry({ ...entry });
    };

    const saveEdit = async () => {
        if (!user || !editingEntry) return;
        const ref = doc(db, 'users', user.uid, editingType, editingEntry.id);
        await updateDoc(ref, {
            amount: parseFloat(editingEntry.amount),
            category: editingEntry.category,
            description: editingEntry.description,
        });
        await updateUserCategories(editingEntry.category, editingType === 'income' ? 'income' : 'expense');
        setEditingEntry(null);
        setEditingType('');
    };

    const deleteEntry = async (type, id) => {
        const ref = doc(db, 'users', user.uid, type, id);
        await deleteDoc(ref);
    };

    const totalIncome = incomeEntries.reduce((acc, entry) => acc + entry.amount, 0);
    const totalExpenses = expenseEntries.reduce((acc, entry) => acc + entry.amount, 0);
    const net = totalIncome - totalExpenses;

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

    return (
        <div style={{ padding: '2rem' }}>
            <h1>🪙 Finances</h1>
            <h2>Net Balance: ${net.toFixed(2)}</h2>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                    <h3>Income</h3>
                    <input type="number" placeholder="Amount" value={newIncome} onChange={(e) => setNewIncome(e.target.value)} />
                    <input type="text" placeholder="Category" value={incomeCategory} onChange={(e) => setIncomeCategory(e.target.value)} />
                    <input type="text" placeholder="Description" value={incomeDescription} onChange={(e) => setIncomeDescription(e.target.value)} />
                    <button onClick={addIncome}>Add</button>
                    <ul>
                        {incomeEntries.map((entry) => (
                            <li key={entry.id}>
                                + ${entry.amount} ({entry.category}) - {entry.description}
                                <button onClick={() => startEditing('income', entry)}>✏️</button>
                                <button onClick={() => deleteEntry('income', entry.id)}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Expenses</h3>
                    <input type="number" placeholder="Amount" value={newExpense} onChange={(e) => setNewExpense(e.target.value)} />
                    <input type="text" placeholder="Category" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} />
                    <input type="text" placeholder="Description" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} />
                    <button onClick={addExpense}>Add</button>
                    <ul>
                        {expenseEntries.map((entry) => (
                            <li key={entry.id}>
                                - ${entry.amount} ({entry.category}) - {entry.description}
                                <button onClick={() => startEditing('expenses', entry)}>✏️</button>
                                <button onClick={() => deleteEntry('expenses', entry.id)}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {editingEntry && (
                <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>Edit Entry</h3>
                    <input
                        type="number"
                        value={editingEntry.amount}
                        onChange={(e) => setEditingEntry({ ...editingEntry, amount: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editingEntry.category}
                        onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editingEntry.description}
                        onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                    />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setEditingEntry(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Finances;
