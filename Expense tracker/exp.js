document.addEventListener("DOMContentLoaded",loadExpenses);

const form = document.getElementById("expense-from")
const expenselist = document.getElementById("exp-list");
const totalamt = document.getElementById("total-amt");
const filtercat = document.getElementById("filter-cat");
const darkmode = document.getElementById("toggle-theme");
const exportcsv = document.getElementById("export-csv");
const expsum = document.getElementById("exp-sum");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

form.addEventListener("submit",function(e) {
    e.preventDefault();

const nm = document.getElementById("exp-name").value;
const amount = parseFloat(document.getElementById("exp-amount").value);
const category =  document.getElementById("exp-cat").value;

if(!nm || amount <= 0) return alert("Please Enter valid date.");

const expense = {id:Date.now(),nm,amount,category};
expenses.push(expense);

saveExpenses();
form.reset();
});

filtercat.addEventListener("change",function(){
    renderExpenses();
});

function renderExpenses(){
    expenselist.innerHTML = "";
    let filterexpense = expenses;

    if(filtercat.value!=="all"){
        filterexpense = expenses.filter(exp => exp.category === filtercat.value);
    }

    filterexpense.forEach(exp => {
        const li = document.createElement("li");
        li.innerHTML = `${exp.nm}  - rs${exp.amount} <span>[${exp.category}]</span>
        <button class="edit-btn" onclick="editexpense(${exp.id})">✏️</button>
        <button class="delete-btn"
        onclick = "deleteExpense(${exp.id})">X</button>`;
        expenselist.appendChild(li);
    });

    totalamt.innerHTML = expenses.reduce((sum,exp) => sum + exp.amount,0);
}

function deleteExpense(id){
    expenses = expenses.filter(exp =>  exp.id !== id);
    saveExpenses();
}

function saveExpenses(){
    localStorage.setItem("expenses",JSON.stringify(expenses));
    renderExpenses();
}

function loadExpenses(){
    renderExpenses();
}

function editexpense(id)
{
    const expense = expenses.find(exp => exp.id === id);
    if(!expense) return;

    document.getElementById("exp-name").value = expense.nm;
    document.getElementById("exp-amount").value = expense.amount;
    document.getElementById("exp-cat").value = expense.category;

    deleteExpense(id);
}

darkmode.addEventListener("click",function(){
    document.body.classList.toggle("dark-mode");
});

function updatesumm()
{
    const summary = {};
    expenses.forEach(exp => {
        summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
    });

    expsum.innerHTML = "";
    for(let category in summary){
        const li =document.createElement("li");
        li.textContent = `${category}: $${summary[category]}`;
        expsum.appendChild(li);
    }
}

exportcsv.addEventListener("click",function(){

    if(expenses.length === 0)
    {
        alert("No Expense to Export");
        return;
    }
    let csvcontent = "data:text/csv;charset=utf-8,Name,Amount,Category\n";
    expenses.forEach(exp => {
        csvcontent += `${exp.nm},${exp.amount},${exp.category}\n`;
    });

    const encodeduri = encodeURI(csvcontent);
    const link = document.createElement("a");
    link.setAttribute("href",encodeduri);
    link.setAttribute("download","expenses.csv");
    document.body.appendChild(link);
    link.click();
});