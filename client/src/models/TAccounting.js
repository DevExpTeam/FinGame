export class TAccount {
  constructor({
    boxName ="",
    debit = [""],
    credit = [""],
  }) {
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
}

export class TArray {
  constructor({
    array = [],
  }) {
    this.array = array;
  }

  get total() {
    return this.array.reduce((sum, TAccount) => sum += TAccount.totalDebit - TAccount.totalCredit, 0);
  }
}
