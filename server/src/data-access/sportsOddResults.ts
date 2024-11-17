import { ObjectId } from 'mongodb';
import { PipelineStage } from 'mongoose';

import SportsMainLeagueModel from '../models/sports/sportsMainLeagues.model';

import { defineKinds, sportOddModels } from "./utils";

export const getMainOdds = async () => {
    try {

    } catch (err) {
        console.error(err);
    }
}

export const findAllMatches = async (DBModel: any, sportsName: string, date: Date) => {
    try {
        
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findMatch = async (DBModel: any, sportsName: string, matchId: string) => {
    try {
        
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findMatchByLeague = async (DBModel: any, sportsName: string, leagueId?: string) => {
    try {
        
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const findLeagueList = async (DBModel: any, sportsName: string, userId: string) => {
    try {
        
    } catch (err) {
        console.error(err);
        return [];
    }
}