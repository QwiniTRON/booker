PGDMP         8                x            booker    12.4    12.4 +    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            =           1262    16393    booker    DATABASE     �   CREATE DATABASE booker WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Russian_Russia.1251' LC_CTYPE = 'Russian_Russia.1251';
    DROP DATABASE booker;
                postgres    false            �            1259    16452    author    TABLE     �   CREATE TABLE public.author (
    id integer NOT NULL,
    description text,
    name character varying(128) NOT NULL,
    photo_path text DEFAULT 'default.png'::text
);
    DROP TABLE public.author;
       public         heap    postgres    false            �            1259    16450    author_id_seq    SEQUENCE     �   CREATE SEQUENCE public.author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.author_id_seq;
       public          postgres    false    211            >           0    0    author_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.author_id_seq OWNED BY public.author.id;
          public          postgres    false    210            �            1259    16396    book    TABLE       CREATE TABLE public.book (
    id integer NOT NULL,
    name character varying(128),
    createdat date,
    photo_path text DEFAULT 'defaultbook.png'::text,
    description text,
    category_id integer DEFAULT '-1'::integer NOT NULL,
    author_id integer
);
    DROP TABLE public.book;
       public         heap    postgres    false            �            1259    16394    book_id_seq    SEQUENCE     �   CREATE SEQUENCE public.book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.book_id_seq;
       public          postgres    false    203            ?           0    0    book_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.book_id_seq OWNED BY public.book.id;
          public          postgres    false    202            �            1259    16432 
   book_likes    TABLE     x   CREATE TABLE public.book_likes (
    id integer NOT NULL,
    book_id integer NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.book_likes;
       public         heap    postgres    false            �            1259    16430    book_likes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.book_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.book_likes_id_seq;
       public          postgres    false    209            @           0    0    book_likes_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.book_likes_id_seq OWNED BY public.book_likes.id;
          public          postgres    false    208            �            1259    16407 
   categories    TABLE     ]   CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(128)
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    16405    categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public          postgres    false    205            A           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public          postgres    false    204            �            1259    16421    person    TABLE     �   CREATE TABLE public.person (
    id integer NOT NULL,
    nickname character varying(128),
    email text NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.person;
       public         heap    postgres    false            �            1259    16419    person_id_seq    SEQUENCE     �   CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.person_id_seq;
       public          postgres    false    207            B           0    0    person_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;
          public          postgres    false    206            �
           2604    16455 	   author id    DEFAULT     f   ALTER TABLE ONLY public.author ALTER COLUMN id SET DEFAULT nextval('public.author_id_seq'::regclass);
 8   ALTER TABLE public.author ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    211    211            �
           2604    16399    book id    DEFAULT     b   ALTER TABLE ONLY public.book ALTER COLUMN id SET DEFAULT nextval('public.book_id_seq'::regclass);
 6   ALTER TABLE public.book ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            �
           2604    16435    book_likes id    DEFAULT     n   ALTER TABLE ONLY public.book_likes ALTER COLUMN id SET DEFAULT nextval('public.book_likes_id_seq'::regclass);
 <   ALTER TABLE public.book_likes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    209    209            �
           2604    16410    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    204    205    205            �
           2604    16424 	   person id    DEFAULT     f   ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);
 8   ALTER TABLE public.person ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207            7          0    16452    author 
   TABLE DATA           C   COPY public.author (id, description, name, photo_path) FROM stdin;
    public          postgres    false    211   U.       /          0    16396    book 
   TABLE DATA           d   COPY public.book (id, name, createdat, photo_path, description, category_id, author_id) FROM stdin;
    public          postgres    false    203   /       5          0    16432 
   book_likes 
   TABLE DATA           :   COPY public.book_likes (id, book_id, user_id) FROM stdin;
    public          postgres    false    209   U1       1          0    16407 
   categories 
   TABLE DATA           .   COPY public.categories (id, name) FROM stdin;
    public          postgres    false    205   �1       3          0    16421    person 
   TABLE DATA           ?   COPY public.person (id, nickname, email, password) FROM stdin;
    public          postgres    false    207   K2       C           0    0    author_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.author_id_seq', 2, true);
          public          postgres    false    210            D           0    0    book_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.book_id_seq', 12, true);
          public          postgres    false    202            E           0    0    book_likes_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.book_likes_id_seq', 27, true);
          public          postgres    false    208            F           0    0    categories_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.categories_id_seq', 11, true);
          public          postgres    false    204            G           0    0    person_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.person_id_seq', 6, true);
          public          postgres    false    206            �
           2606    16461    author author_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.author DROP CONSTRAINT author_pkey;
       public            postgres    false    211            �
           2606    16437    book_likes book_likes_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.book_likes
    ADD CONSTRAINT book_likes_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.book_likes DROP CONSTRAINT book_likes_pkey;
       public            postgres    false    209            �
           2606    16404    book book_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.book DROP CONSTRAINT book_pkey;
       public            postgres    false    203            �
           2606    16412    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    205            �
           2606    16429    person person_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.person DROP CONSTRAINT person_pkey;
       public            postgres    false    207            �
           2606    16463    book book_author_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON DELETE SET NULL;
 B   ALTER TABLE ONLY public.book DROP CONSTRAINT book_author_id_fkey;
       public          postgres    false    211    2731    203            �
           2606    16414    book book_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET DEFAULT;
 D   ALTER TABLE ONLY public.book DROP CONSTRAINT book_category_id_fkey;
       public          postgres    false    203    205    2725            �
           2606    16438 "   book_likes book_likes_book_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.book_likes
    ADD CONSTRAINT book_likes_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.book_likes DROP CONSTRAINT book_likes_book_id_fkey;
       public          postgres    false    209    203    2723            �
           2606    16443 "   book_likes book_likes_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.book_likes
    ADD CONSTRAINT book_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.person(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.book_likes DROP CONSTRAINT book_likes_user_id_fkey;
       public          postgres    false    209    207    2727            7   �   x�e���0�k{�7 ��� �� D=�",��l KI��
�6����ݻ�\�B�{�OA�AO����D�q� /�u�U=�r�&m��t*A�;F|+2��2�-55��|�]n�z����M��Zf���2=��f8|`�3���n�/w쬵o���      /   8  x��TKn�0]S��*A�$K�K7��&�t+A����9�E��+�ܨoH�Q�0ЍMGo��{�Q��j�������O��5U����lⅲq��q�L�xsh��Ǉ����+�4 ���9�6�_㯤_�<CZOkMw���?�L���ZQ���G�RV���+�
�S����3�@e ���s% i��L � �h�%���i��l��ƃu���¶�f/vK�J��1[+�ra[)��ekU�l�@��� ��(4L���n�b��A�&����C�¸��҉|�3�u�q&��X������Iϝl�����g�rη&��/4������y��C�Rl�ӵ��Sᅷ�F�[�q
�px��!u1^*�3�a�{��:�L��C���6݋�)(@)���":,�.���莡?�t�ٶ��j���	B��Q �3$T�-aBP0�OL���"j�b(-E�06a<�J4ݯ=[�g1�b=��4N.#xu��x+���b�ŵ5Ӣp�7���O޽>98:z����v������k��Qc|�M      5   6   x��� 0�7	;>�I�u��0BZ�C�Y%
Azi�`�'ZBZk���;�      1   �   x�-O��0���`��f�i�;�`�А�\K�
�Fȥ?��H���֢��`�#cD����t��n�n�h���nod��Dv��*���x�^Б���0��A�P�Tx�q������:T=	�|w���mVTG/Iϕ8�_��L]����T����      3   �   x�]��r�0 �5���|uWH�����N7��Q�H��׷���,�(���g�^$�ƲIj�����T���q�=�)���q���:&��y�U�F-=��p�Ư��#�	���s���δ�wY�}������&p�7U������Gtj����8�ߴ�|�ĥ�%U|ݫ�_ �{bw�]޻̗x�Ŋ��.dE?!��qK�     