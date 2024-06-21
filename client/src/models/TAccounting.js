export class TAccount {
  constructor({
    name = "",
    boxName ="",
    debit = [""],
    credit = [""],
  }) {
    this.name = name;
    this.boxName = boxName;
    this.debit = debit;
    this.credit = credit;
  }

  get totalDebit() {
    return this.debit.reduce((sum, item) => sum += Number(item), 0);
  }

  get totalCredit() {
    return this.credit.reduce((sum, item) => sum += Number(item), 0);
  }

  get total() {
    const value = this.totalDebit - this.totalCredit;
    return this.boxName.includes("debit") ? value : -value;
  }
}

export class TArray {
  constructor({
    array = [],
  }) {
    this.array = array;
  }

  get total() {
    return this.array.reduce((sum, TAccount) => sum += Number(TAccount.total), 0);
  }
}
