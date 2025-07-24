import { capitalizeFirstLetter } from '@/lib/utils';
import React, { useState } from 'react';
import { Difficulty, QuestionType, questionTypes } from '../pages/quiz/config/config';

const useQuizConfig = () => {
    const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
    const [numOfQuestions, setNumOfQuestions] = useState<number>(10);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [randomOrder, setRandomOrder] = useState<boolean>(true);
    const [currentPreset, setCurrentPreset] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    /*  When a preset is clicked, it changes the configuration */
    const handlePreset = (type: QuestionType, numOfQuestions: number) => {
        if (!type || !questionTypes.includes(type)) return;

        setSelectedTypes([type]);
        setCurrentPreset(type);
        setNumOfQuestions(numOfQuestions);
    };

    // In advance configuration, users can set multiple question types
    const handleAdvanceConfig = (type: QuestionType) => {
        if (!type || !questionTypes.includes(type)) return;

        // Clear preset
        if (currentPreset) {
            setCurrentPreset('');
        }

        // If chosen type is mixed, remove all existing types and replace with mixed
        if (type === 'Mixed') {
            setSelectedTypes([type]);
            return;
        }

        // If there is a Mixed type, remove it
        if (selectedTypes.includes('Mixed')) {
            const removeMixed = selectedTypes.filter((currentType) => currentType !== 'Mixed');
            setSelectedTypes([...removeMixed, type]);
            return;
        }

        // If already included, remove it
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((currentType) => currentType !== type));
            return;
        }

        setSelectedTypes([...selectedTypes, type]);
    };

    const handleNumOfQuestions = (num: number) => {
        setNumOfQuestions(num);
    };

    const handleDifficulty = (difficulty: Difficulty) => {
        setDifficulty(difficulty);
    };

    const handleRandomOrder = (randomOrder: boolean) => {
        setRandomOrder(randomOrder);
    };

    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleanStr = capitalizeFirstLetter(e.target.value);
        setTitle(cleanStr);
    };

    return {
        /* States */
        values: {
            title,
            selectedTypes,
            numOfQuestions,
            difficulty,
            randomOrder,
            currentPreset,
        },

        /* Helper functions */
        handlers: {
            handlePreset,
            handleAdvanceConfig,
            handleNumOfQuestions,
            handleDifficulty,
            handleRandomOrder,
            handleSetTitle,
        },
    };
};

export default useQuizConfig;
