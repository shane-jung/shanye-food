import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import axios from '../axios';
import RecipeForm from '../components/RecipeForm';
import { useRequestProcessor } from '../query';
import { Recipe } from '../types';

export default function CreateRecipePage() {
    const navigate = useNavigate();

    const { mutate } = useRequestProcessor();
    const mutationObject = mutate(['recipes'], (data: Recipe) => {
        return axios.post(`recipes/`, data);
    });

    const onSubmit: SubmitHandler<Recipe> = async (data) => {
        try {
            const res = await mutationObject.mutateAsync(data);
            navigate(`/recipes/${data.slug}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="mb-2 text-center text-3xl">Create New Recipe</h2>
            <RecipeForm onSubmit={onSubmit} />
        </div>
    );
}
