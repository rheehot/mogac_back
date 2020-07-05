import * as I from "../../lib/helper/interfaces";
import { User } from "../../models/Users";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { TeamType, Team } from "../../models/Teams";
import { GetAllTeamResponseType } from "./dto/getAllTeamResponsetype";
import {
  PaginateArgType,
  FilterPaginateArgType,
} from "../common/PaginateArgType";
import { TeamService } from "../../services/Team.service";
import { ResolveContext } from "../../lib/graphql/resolve-context";

@Resolver((of) => TeamType)
export class TeamsResolver {
  constructor(
    // constructor injection of a service
    private readonly teamService: TeamService
  ) {}

  @Query((_return) => GetAllTeamResponseType)
  async getAllTeam(
    @Arg("data") data: PaginateArgType
  ): Promise<I.Maybe<GetAllTeamResponseType>> {
    // 최대 페이지, 현제 페이지 내용 받기
    return await this.teamService.getAllTeams(data);
  }

  @Query((_return) => GetAllTeamResponseType)
  async getFilterTeam(
    @Arg("data") data: FilterPaginateArgType
  ): Promise<I.Maybe<GetAllTeamResponseType>> {
    // 최대 페이지, 현제 페이지 내용 받기
    return await this.teamService.getFilterTeams(data);
  }

  @Query(() => TeamType)
  async getTeamById(@Arg("teamId") teamId: I.ObjectId) {
    const result = this.teamService.tryFindById(teamId);
    return result;
  }

  @Mutation(() => TeamType)
  async addBlackList(
    @Arg("userId") userId: string,
    @Arg("teamId") teamId: string
  ) {
    const result = this.teamService.addBlackList(userId, teamId);
    return result;
  }

  @Mutation(() => TeamType)
  async addChatData(
    @Arg("chat") chat: string,
    @Arg("teamId") teamId: I.ObjectId,
    @Ctx() ctx: ResolveContext
  ) {
    if (ctx.user) {
      const chatData = `${ctx.user.name}/${Date.now()}/${chat}`;
      const result = this.teamService.addChatData(chatData, teamId);
      return result;
    }
  }
}
