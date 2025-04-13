import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
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
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Grid,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Layout from '../Layout';

function EntrySection({
    title,
    entries,
    newAmount,
    setNewAmount,
    category,
    setCategory,
    description,
    setDescription,
    categories,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <Card sx={{ width: '100%', height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Amount"
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                />
                <CreatableSelect
                    options={categories.map((cat) => ({ value: cat, label: cat }))}
                    onChange={(option) => setCategory(option?.value || '')}
                    value={category ? { label: category, value: category } : null}
                    isClearable
                    isSearchable
                    placeholder="Select or type category"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button variant="contained" onClick={onAdd}>Add</Button>
            </Box>
            <List>
                {entries.map((entry) => (
                    <ListItem key={entry.id} secondaryAction={
                        <>
                            <IconButton onClick={() => onEdit(entry)}><Edit /></IconButton>
                            <IconButton onClick={() => onDelete(entry.id)}><Delete /></IconButton>
                        </>
                    }>
                        <ListItemText
                            primary={`${title === 'Income' ? '+' : '-'} $${entry.amount} (${entry.category})`}
                            secondary={entry.description}
                        />
                    </ListItem>
                ))}
            </List>
        </Card>
    );
}

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

    const totalIncome = incomeEntries.reduce((acc, entry) => acc + entry.amount, 0);
    const totalExpenses = expenseEntries.reduce((acc, entry) => acc + entry.amount, 0);
    const net = totalIncome - totalExpenses;

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
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>🪙 Finances</Typography>
                <Typography variant="h6" gutterBottom>Net Balance: ${net.toFixed(2)}</Typography>
                <Grid container spacing={2}>
                    <Grid size={6} sx={{ display: 'flex' }}>
                        <EntrySection
                            title="Income"
                            entries={incomeEntries}
                            newAmount={newIncome}
                            setNewAmount={setNewIncome}
                            category={incomeCategory}
                            setCategory={setIncomeCategory}
                            description={incomeDescription}
                            setDescription={setIncomeDescription}
                            categories={incomeCategories}
                            onAdd={addIncome}
                            onEdit={(entry) => startEditing('income', entry)}
                            onDelete={(id) => deleteEntry('income', id)}
                        />
                    </Grid>
                    <Grid size={6} sx={{ display: 'flex' }}>
                        <EntrySection
                            title="Expenses"
                            entries={expenseEntries}
                            newAmount={newExpense}
                            setNewAmount={setNewExpense}
                            category={expenseCategory}
                            setCategory={setExpenseCategory}
                            description={expenseDescription}
                            setDescription={setExpenseDescription}
                            categories={expenseCategories}
                            onAdd={addExpense}
                            onEdit={(entry) => startEditing('expenses', entry)}
                            onDelete={(id) => deleteEntry('expenses', id)}
                        />
                    </Grid>
                </Grid>

                {editingEntry && (
                    <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2}>
                        <Typography variant="h6">Edit Entry</Typography>
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            <TextField
                                label="Amount"
                                type="number"
                                value={editingEntry.amount}
                                onChange={(e) => setEditingEntry({ ...editingEntry, amount: e.target.value })}
                            />
                            <CreatableSelect
                                options={(editingType === 'income' ? incomeCategories : expenseCategories).map((cat) => ({ value: cat, label: cat }))}
                                onChange={(option) => setEditingEntry({ ...editingEntry, category: option?.value || '' })}
                                value={editingEntry.category ? { label: editingEntry.category, value: editingEntry.category } : null}
                                isClearable
                                isSearchable
                                placeholder="Select or type category"
                            />
                            <TextField
                                label="Description"
                                value={editingEntry.description}
                                onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                            />
                            <Box display="flex" gap={2}>
                                <Button variant="contained" onClick={saveEdit}>Save</Button>
                                <Button variant="outlined" onClick={() => setEditingEntry(null)}>Cancel</Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Layout>
    );
}

export default Finances;
