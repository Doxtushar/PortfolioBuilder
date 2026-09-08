import { getConstraintName, isUniqueViolation } from "../repositories/authRepository.js";
import {
  portfolioRepository,
  type PortfolioRepository,
} from "../repositories/portfolioRepository.js";
import type { CreatePortfolioInput, Portfolio, UpdatePortfolioInput } from "../types/portfolio.js";
import { AppError } from "../utils/AppError.js";

const toPortfolio = (portfolio: Awaited<ReturnType<PortfolioRepository["create"]>>): Portfolio => ({
  id: portfolio.id,
  username: portfolio.username,
  title: portfolio.title,
  bio: portfolio.bio,
  fullName: portfolio.fullName,
  headline: portfolio.headline,
  location: portfolio.location,
  introduction: portfolio.introduction,
  profileImageUrl: portfolio.profileImageUrl,
  createdAt: portfolio.createdAt.toISOString(),
  updatedAt: portfolio.updatedAt.toISOString(),
});

type PortfolioServiceDependencies = {
  repository?: PortfolioRepository;
};

export const createPortfolioService = ({
  repository = portfolioRepository,
}: PortfolioServiceDependencies = {}) => ({
  async createPortfolio(userId: string, input: CreatePortfolioInput): Promise<Portfolio> {
    try {
      return toPortfolio(await repository.create(userId, input));
    } catch (error) {
      if (isUniqueViolation(error)) {
        const constraint = getConstraintName(error);

        if (constraint === "portfolios_username_unique") {
          throw new AppError("Username is already in use", 409, "USERNAME_ALREADY_EXISTS");
        }

        if (constraint === "portfolios_user_id_unique") {
          throw new AppError("Portfolio already exists", 409, "PORTFOLIO_ALREADY_EXISTS");
        }
      }

      throw error;
    }
  },

  async getPortfolio(userId: string): Promise<Portfolio> {
    const portfolio = await repository.findByUserId(userId);

    if (!portfolio) {
      throw new AppError("Portfolio not found", 404, "PORTFOLIO_NOT_FOUND");
    }

    return toPortfolio(portfolio);
  },

  async updatePortfolio(userId: string, input: UpdatePortfolioInput): Promise<Portfolio> {
    try {
      const portfolio = await repository.update(userId, input);

      if (!portfolio) {
        throw new AppError("Portfolio not found", 404, "PORTFOLIO_NOT_FOUND");
      }

      return toPortfolio(portfolio);
    } catch (error) {
      if (
        isUniqueViolation(error) &&
        getConstraintName(error) === "portfolios_username_unique"
      ) {
        throw new AppError("Username is already in use", 409, "USERNAME_ALREADY_EXISTS");
      }

      throw error;
    }
  },
});

export const portfolioService = createPortfolioService();
