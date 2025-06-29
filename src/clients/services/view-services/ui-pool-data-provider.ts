import { AccountAddress } from "@aptos-labs/ts-sdk";
import { AptosBaseService } from "../base";
import { UiPoolDataProviderGetReservesDataFuncAddr } from "@/clients/configs/move-functions";

export type AggregatedReserveData = {
  underlyingAsset: AccountAddress;
  name: string;
  symbol: string;
  decimals: number;
  baseLTVasCollateral: bigint;
  reserveLiquidationThreshold: bigint;
  reserveLiquidationBonus: bigint;
  reserveFactor: bigint;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  // base data
  liquidityIndex: bigint;
  variableBorrowIndex: bigint;
  liquidityRate: bigint;
  variableBorrowRate: bigint;
  lastUpdateTimestamp: number;
  aTokenAddress: AccountAddress;
  variableDebtTokenAddress: AccountAddress;
  //
  availableLiquidity: bigint;
  totalScaledVariableDebt: bigint;
  priceInMarketReferenceCurrency: bigint;
  priceOracle: AccountAddress;
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  baseVariableBorrowRate: bigint;
  optimalUsageRatio: bigint;
  // v3 only
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: bigint;
  unbacked: bigint;
  isolationModeTotalDebt: bigint;
  flashLoanEnabled: boolean;
  //
  debtCeiling: bigint;
  debtCeilingDecimals: number;
  eModeCategoryId: number;
  borrowCap: bigint;
  supplyCap: bigint;
  // e_mode
  eModeLtv: bigint;
  eModeLiquidationThreshold: bigint;
  eModeLiquidationBonus: bigint;
  eModePriceSource: AccountAddress;
  eModeLabel: string;
  borrowableInIsolation: boolean;
};

export type BaseCurrencyData = {
  marketReferenceCurrencyDecimals: number;
  marketReferenceCurrencyPriceInUsd: bigint;
  networkBaseTokenPriceInUsd: bigint;
  networkBaseTokenPriceDecimals: number;
};

export type UserReserveData = {
  underlyingAsset: AccountAddress;
  scaledATokenBalance: bigint;
  usageAsCollateralEnabledOnUser: boolean;
  scaledVariableDebt: bigint;
};

export type ReservesData = {
  reservesData: AggregatedReserveData[];
  baseCurrencyData: BaseCurrencyData;
};

export class UiPoolDataProviderService extends AptosBaseService {
  public async getReservesData(): Promise<ReservesData> {
    const resp = await this.callViewMethod(UiPoolDataProviderGetReservesDataFuncAddr, []);
    const aggregatedReserveDataRaw = resp.at(0) as Array<any>;
    const reservesData = aggregatedReserveDataRaw.map((item) => ({
      underlyingAsset: AccountAddress.fromString(item.underlying_asset.toString()),
      name: item.name as string,
      symbol: item.symbol as string,
      decimals: Number(item.decimals.toString()),
      baseLTVasCollateral: BigInt(item.base_lt_vas_collateral),
      reserveLiquidationThreshold: BigInt(item.reserve_liquidation_threshold),
      reserveLiquidationBonus: BigInt(item.reserve_liquidation_bonus),
      reserveFactor: BigInt(item.reserve_factor),
      usageAsCollateralEnabled: item.usage_as_collateral_enabled as boolean,
      borrowingEnabled: item.borrowing_enabled as boolean,
      isActive: item.is_active as boolean,
      isFrozen: item.is_frozen as boolean,
      // base data
      liquidityIndex: BigInt(item.liquidity_index),
      variableBorrowIndex: BigInt(item.variable_borrow_index),
      liquidityRate: BigInt(item.liquidity_rate),
      variableBorrowRate: BigInt(item.variable_borrow_rate),
      lastUpdateTimestamp: Number(item.last_update_timestamp.toString()),
      aTokenAddress: AccountAddress.fromString(item.a_token_address.toString()),
      variableDebtTokenAddress: AccountAddress.fromString(item.variable_debt_token_address.toString()),
      //
      availableLiquidity: BigInt(item.available_liquidity),
      totalScaledVariableDebt: BigInt(item.total_scaled_variable_debt),
      priceInMarketReferenceCurrency: BigInt(item.price_in_market_reference_currency),
      priceOracle: AccountAddress.fromString(item.price_oracle.toString()),
      variableRateSlope1: BigInt(item.variable_rate_slope1),
      variableRateSlope2: BigInt(item.variable_rate_slope2),
      baseVariableBorrowRate: BigInt(item.base_variable_borrow_rate),
      optimalUsageRatio: BigInt(item.optimal_usage_ratio),
      // v3 only
      isPaused: item.is_paused as boolean,
      isSiloedBorrowing: item.is_siloed_borrowing as boolean,
      accruedToTreasury: BigInt(item.accrued_to_treasury),
      unbacked: BigInt(item.unbacked),
      isolationModeTotalDebt: BigInt(item.isolation_mode_total_debt),
      flashLoanEnabled: item.flash_loan_enabled as boolean,
      //
      debtCeiling: BigInt(item.debt_ceiling),
      debtCeilingDecimals: Number(item.debt_ceiling_decimals.toString()),
      eModeCategoryId: Number(item.e_mode_category_id.toString()),
      borrowCap: BigInt(item.borrow_cap),
      supplyCap: BigInt(item.supply_cap),
      // e_mode
      eModeLtv: BigInt(item.e_mode_ltv.toString()),
      eModeLiquidationThreshold: BigInt(item.e_mode_liquidation_threshold.toString()),
      eModeLiquidationBonus: BigInt(item.e_mode_liquidation_bonus.toString()),
      eModePriceSource: AccountAddress.fromString(item.e_mode_price_source.toString()),
      eModeLabel: item.e_mode_label as string,
      borrowableInIsolation: item.borrowable_in_isolation as boolean,
    }));

    const basicCurrencyInfoRaw = resp.at(1) as any;
    const baseCurrencyData = {
      marketReferenceCurrencyDecimals: Number(basicCurrencyInfoRaw.market_reference_currency_unit.toString()),
      marketReferenceCurrencyPriceInUsd: BigInt(basicCurrencyInfoRaw.market_reference_currency_price_in_usd),
      networkBaseTokenPriceInUsd: BigInt(basicCurrencyInfoRaw.network_base_token_price_in_usd.toString()),
      networkBaseTokenPriceDecimals: Number(basicCurrencyInfoRaw.network_base_token_price_decimals.toString()),
    };

    return { reservesData, baseCurrencyData };
  }
}
