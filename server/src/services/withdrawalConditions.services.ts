// Model
import WithdrawalConditions from '../models/withdrawalConditions.model';

export const updateWithdrawalCondition = async (customerId: string, currencyId: string, amount: number) => {
    if(0 > amount) {
        console.log("updateWithdrawalCondition error. The amount cannot be negative.")
        return
    }
    
    try {
        const withdrawalCondition = await WithdrawalConditions.findOne({
            customerId: customerId,
            currencyId: currencyId
        });

        if (withdrawalCondition) {
            if(withdrawalCondition.totalUsed >= withdrawalCondition.totalDeposited) {
                withdrawalCondition.totalUsed = withdrawalCondition.totalDeposited
            } else {
                withdrawalCondition.totalUsed += amount;
            }

            await withdrawalCondition.save();
        }
    } catch (error) {
        console.error('Error updating withdrawal condition:', error);
    }
}